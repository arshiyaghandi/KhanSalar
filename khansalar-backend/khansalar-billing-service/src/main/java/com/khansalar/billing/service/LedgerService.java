package com.khansalar.billing.service;

import com.khansalar.billing.domain.DailyClosing;
import com.khansalar.billing.domain.Invoice;
import com.khansalar.billing.domain.LedgerEntry;
import com.khansalar.billing.domain.LedgerItem;
import com.khansalar.billing.domain.PaymentRecord;
import com.khansalar.billing.repository.DailyClosingRepository;
import com.khansalar.billing.repository.InvoiceRepository;
import com.khansalar.billing.repository.LedgerEntryRepository;
import com.khansalar.billing.repository.LedgerItemRepository;
import com.khansalar.billing.repository.PaymentRecordRepository;
import com.khansalar.common.dto.LedgerEntryDto;
import com.khansalar.common.dto.LedgerItemDto;
import com.khansalar.common.enums.AccountType;
import com.khansalar.common.enums.InvoiceStatus;
import com.khansalar.common.enums.PaymentMethod;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerEntryRepository ledgerEntryRepository;
    private final LedgerItemRepository ledgerItemRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final DailyClosingRepository dailyClosingRepository;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    /**
     * Creates balanced double-entry accounting ledger entries for settled invoice:
     * Debit: Cash or POS Bank Account (Asset)
     * Debit: Sales Discount Allowance (Contra-Revenue/Expense) if discount > 0
     * Credit: Sales Revenue (Revenue)
     * Credit: VAT Payable (Liability)
     */
    @Transactional
    public Mono<LedgerEntry> createSalesLedgerEntry(Invoice invoice, PaymentRecord payment) {
        int randomSuffix = 1000 + SECURE_RANDOM.nextInt(9000);
        String entryNumber = "JE-" + System.currentTimeMillis() + "-" + randomSuffix;
        String desc = "Sales invoice settlement: " + invoice.getInvoiceNumber() + " via " + payment.getPaymentMethod();

        LedgerEntry entry = LedgerEntry.builder()
                .entryNumber(entryNumber)
                .description(desc)
                .referenceType("INVOICE")
                .referenceId(invoice.getInvoiceNumber())
                .transactionDate(Instant.now())
                .build();

        return ledgerEntryRepository.save(entry)
                .flatMap(savedEntry -> {
                    String debitAccount = payment.getPaymentMethod() == PaymentMethod.CASH 
                            ? "Cash Drawer - Khansalar" 
                            : "POS Bank Account";

                    List<LedgerItem> itemsToSave = new ArrayList<>();

                    // 1. Debit item (Cash or Bank asset received)
                    itemsToSave.add(LedgerItem.builder()
                            .ledgerEntryId(savedEntry.getId())
                            .accountName(debitAccount)
                            .accountType(AccountType.ASSET)
                            .debit(invoice.getFinalAmount())
                            .credit(BigDecimal.ZERO)
                            .build());

                    // 2. Debit item for sales discount (contra-revenue) if discount was applied
                    if (invoice.getDiscountAmount() != null && invoice.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                        itemsToSave.add(LedgerItem.builder()
                                .ledgerEntryId(savedEntry.getId())
                                .accountName("Sales Discount and VIP Allowance")
                                .accountType(AccountType.EXPENSE)
                                .debit(invoice.getDiscountAmount())
                                .credit(BigDecimal.ZERO)
                                .build());
                    }

                    // 3. Credit item for sales revenue (Subtotal + Service fee)
                    BigDecimal salesRevenue = invoice.getSubTotal().add(invoice.getServiceFee());
                    itemsToSave.add(LedgerItem.builder()
                            .ledgerEntryId(savedEntry.getId())
                            .accountName("Food and Beverage Sales Revenue")
                            .accountType(AccountType.REVENUE)
                            .debit(BigDecimal.ZERO)
                            .credit(salesRevenue)
                            .build());

                    // 4. Credit item for VAT tax liability
                    itemsToSave.add(LedgerItem.builder()
                            .ledgerEntryId(savedEntry.getId())
                            .accountName("VAT Tax Payable")
                            .accountType(AccountType.LIABILITY)
                            .debit(BigDecimal.ZERO)
                            .credit(invoice.getTaxAmount())
                            .build());

                    return ledgerItemRepository.saveAll(itemsToSave)
                            .then(Mono.just(savedEntry));
                });
    }

    /**
     * Daily closing and balance settlement report based on real recorded payment data
     */
    @Transactional
    public Mono<DailyClosing> closeDay(String closingDate, String closedBy) {
        return dailyClosingRepository.findByClosingDate(closingDate)
                .flatMap(existing -> Mono.<DailyClosing>error(new IllegalStateException("Accounts for date " + closingDate + " have already been closed and locked")))
                .switchIfEmpty(Mono.defer(() ->
                        invoiceRepository.findByStatus(InvoiceStatus.PAID)
                                .collectList()
                                .flatMap(paidInvoices -> {
                                    BigDecimal totalSales = paidInvoices.stream()
                                            .map(Invoice::getFinalAmount)
                                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                                    BigDecimal totalTax = paidInvoices.stream()
                                            .map(Invoice::getTaxAmount)
                                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                                    return paymentRecordRepository.findAll()
                                            .collectList()
                                            .flatMap(payments -> {
                                                BigDecimal totalCash = payments.stream()
                                                        .filter(p -> p.getPaymentMethod() == PaymentMethod.CASH)
                                                        .map(PaymentRecord::getAmount)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                                BigDecimal totalPos = payments.stream()
                                                        .filter(p -> p.getPaymentMethod() != PaymentMethod.CASH)
                                                        .map(PaymentRecord::getAmount)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                                DailyClosing closing = DailyClosing.builder()
                                                        .closingDate(closingDate)
                                                        .totalSales(totalSales)
                                                        .totalCash(totalCash)
                                                        .totalPos(totalPos)
                                                        .totalTax(totalTax)
                                                        .orderCount(paidInvoices.size())
                                                        .closedBy(closedBy != null ? closedBy : "Floor Manager")
                                                        .createdAt(Instant.now())
                                                        .build();

                                                return dailyClosingRepository.save(closing);
                                            });
                                })
                ));
    }

    public Flux<LedgerEntryDto> getAllLedgerEntriesWithItems() {
        return ledgerEntryRepository.findAll()
                .flatMap(entry -> ledgerItemRepository.findByLedgerEntryId(entry.getId())
                        .map(item -> LedgerItemDto.builder()
                                .id(item.getId())
                                .accountName(item.getAccountName())
                                .accountType(item.getAccountType())
                                .debit(item.getDebit())
                                .credit(item.getCredit())
                                .build())
                        .collectList()
                        .map(items -> LedgerEntryDto.builder()
                                .id(entry.getId())
                                .entryNumber(entry.getEntryNumber())
                                .description(entry.getDescription())
                                .referenceType(entry.getReferenceType())
                                .referenceId(entry.getReferenceId())
                                .transactionDate(entry.getTransactionDate())
                                .items(items)
                                .build())
                );
    }

    public Flux<LedgerEntry> getAllLedgerEntries() {
        return ledgerEntryRepository.findAll();
    }
}
