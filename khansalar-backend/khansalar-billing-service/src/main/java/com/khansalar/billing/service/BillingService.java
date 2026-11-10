package com.khansalar.billing.service;

import com.khansalar.billing.domain.Invoice;
import com.khansalar.billing.domain.PaymentRecord;
import com.khansalar.billing.dto.PayInvoiceRequest;
import com.khansalar.billing.kafka.KafkaBillingProducer;
import com.khansalar.billing.repository.InvoiceRepository;
import com.khansalar.billing.repository.PaymentRecordRepository;
import com.khansalar.common.enums.InvoiceStatus;
import com.khansalar.common.events.InvoiceGeneratedEvent;
import com.khansalar.common.events.OrderPaidEvent;
import com.khansalar.common.events.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final LedgerService ledgerService;
    private final KafkaBillingProducer kafkaProducer;

    @Value("${khansalar.accounting.tax-rate-percent:10.0}")
    private double taxRatePercent;

    @Value("${khansalar.accounting.service-fee-percent:5.0}")
    private double serviceFeePercent;

    @Transactional
    public Mono<Invoice> generateInvoiceFromOrder(OrderPlacedEvent event) {
        log.info("Generating invoice for order {} with total amount {}", event.getOrderNumber(), event.getTotalAmount());

        // Idempotency check: if invoice for this order already exists, do not recreate
        return invoiceRepository.findByOrderId(event.getOrderId())
                .flatMap(existingInvoice -> {
                    log.info("Invoice {} already exists for order {}, returning existing record", 
                            existingInvoice.getInvoiceNumber(), event.getOrderId());
                    return Mono.just(existingInvoice);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    BigDecimal subTotal = event.getTotalAmount() != null ? event.getTotalAmount() : BigDecimal.ZERO;
                    BigDecimal taxAmount = subTotal.multiply(BigDecimal.valueOf(taxRatePercent / 100.0)).setScale(2, RoundingMode.HALF_UP);
                    BigDecimal serviceFee = subTotal.multiply(BigDecimal.valueOf(serviceFeePercent / 100.0)).setScale(2, RoundingMode.HALF_UP);
                    BigDecimal discount = event.getDiscountAmount() != null ? event.getDiscountAmount() : BigDecimal.ZERO;
                    BigDecimal finalAmount = subTotal.add(taxAmount).add(serviceFee).subtract(discount);

                    String invoiceNumber = "INV-" + event.getOrderNumber();

                    Invoice invoice = Invoice.builder()
                            .invoiceNumber(invoiceNumber)
                            .orderId(event.getOrderId())
                            .subTotal(subTotal)
                            .taxAmount(taxAmount)
                            .serviceFee(serviceFee)
                            .discountAmount(discount)
                            .finalAmount(finalAmount)
                            .status(InvoiceStatus.ISSUED)
                            .issuedAt(Instant.now())
                            .build();

                    return invoiceRepository.save(invoice)
                            .doOnSuccess(saved -> {
                                InvoiceGeneratedEvent genEvent = InvoiceGeneratedEvent.builder()
                                        .invoiceId(saved.getId().toString())
                                        .invoiceNumber(saved.getInvoiceNumber())
                                        .orderId(saved.getOrderId())
                                        .subTotal(saved.getSubTotal())
                                        .taxAmount(saved.getTaxAmount())
                                        .serviceFee(saved.getServiceFee())
                                        .discountAmount(saved.getDiscountAmount())
                                        .finalAmount(saved.getFinalAmount())
                                        .issuedAt(saved.getIssuedAt())
                                        .build();
                                kafkaProducer.publishInvoiceGenerated(genEvent);
                            });
                }));
    }

    @Transactional
    public Mono<Invoice> payInvoice(Long invoiceId, PayInvoiceRequest request) {
        return invoiceRepository.findById(invoiceId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Invoice not found with id: " + invoiceId)))
                .flatMap(invoice -> {
                    if (invoice.getStatus() == InvoiceStatus.PAID) {
                        return Mono.error(new IllegalStateException("Invoice has already been paid and settled"));
                    }

                    BigDecimal paymentAmount = request.getAmount() != null ? request.getAmount() : invoice.getFinalAmount();
                    if (paymentAmount.compareTo(BigDecimal.ZERO) <= 0) {
                        return Mono.error(new IllegalArgumentException("Payment amount must be strictly positive"));
                    }

                    invoice.setStatus(InvoiceStatus.PAID);
                    invoice.setPaidAt(Instant.now());

                    PaymentRecord payment = PaymentRecord.builder()
                            .invoiceId(invoice.getId())
                            .amount(paymentAmount)
                            .paymentMethod(request.getPaymentMethod())
                            .trackingCode(request.getTrackingCode())
                            .cashierName(request.getCashierName() != null ? request.getCashierName() : "Cashier")
                            .paidAt(Instant.now())
                            .build();

                    return invoiceRepository.save(invoice)
                            .flatMap(savedInvoice -> paymentRecordRepository.save(payment)
                                    .flatMap(savedPayment -> ledgerService.createSalesLedgerEntry(savedInvoice, savedPayment)
                                            .then(Mono.fromRunnable(() -> {
                                                OrderPaidEvent paidEvent = OrderPaidEvent.builder()
                                                        .orderId(savedInvoice.getOrderId())
                                                        .invoiceId(savedInvoice.getId().toString())
                                                        .paidAmount(savedPayment.getAmount())
                                                        .paymentMethod(savedPayment.getPaymentMethod())
                                                        .trackingCode(savedPayment.getTrackingCode())
                                                        .cashierName(savedPayment.getCashierName())
                                                        .paidAt(savedPayment.getPaidAt())
                                                        .build();
                                                kafkaProducer.publishOrderPaid(paidEvent);
                                            }))
                                            .thenReturn(savedInvoice)
                                    )
                            );
                });
    }

    public Flux<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Mono<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }
}
