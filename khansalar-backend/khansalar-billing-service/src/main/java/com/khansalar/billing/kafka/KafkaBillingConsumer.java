package com.khansalar.billing.kafka;

import com.khansalar.billing.service.BillingService;
import com.khansalar.common.events.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaBillingConsumer {

    private final BillingService billingService;

    @KafkaListener(topics = "${khansalar.kafka.topics.order-placed:khansalar.order.placed}", groupId = "khansalar-billing-group")
    public void handleOrderPlaced(OrderPlacedEvent event) {
        log.info("Received OrderPlacedEvent from Kafka [OrderId: {}, Amount: {}]", event.getOrderId(), event.getTotalAmount());
        try {
            billingService.generateInvoiceFromOrder(event)
                    .doOnSuccess(inv -> log.info("Invoice {} generated successfully for order {}", inv.getInvoiceNumber(), event.getOrderNumber()))
                    .doOnError(err -> log.error("Error generating invoice for order {}", event.getOrderNumber(), err))
                    .block(Duration.ofSeconds(15));
        } catch (Exception ex) {
            log.error("Fatal failure processing OrderPlacedEvent in Billing Consumer: {}", ex.getMessage(), ex);
            throw ex;
        }
    }
}
