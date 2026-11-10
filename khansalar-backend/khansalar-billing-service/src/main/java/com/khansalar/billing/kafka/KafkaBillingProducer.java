package com.khansalar.billing.kafka;

import com.khansalar.common.events.InvoiceGeneratedEvent;
import com.khansalar.common.events.OrderPaidEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaBillingProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${khansalar.kafka.topics.invoice-generated:khansalar.invoice.generated}")
    private String invoiceGeneratedTopic;

    @Value("${khansalar.kafka.topics.order-paid:khansalar.order.paid}")
    private String orderPaidTopic;

    public void publishInvoiceGenerated(InvoiceGeneratedEvent event) {
        log.info("Publishing InvoiceGeneratedEvent to Kafka [Invoice: {}]", event.getInvoiceNumber());
        kafkaTemplate.send(invoiceGeneratedTopic, event.getInvoiceId(), event);
    }

    public void publishOrderPaid(OrderPaidEvent event) {
        log.info("Publishing OrderPaidEvent to Kafka [OrderId: {}]", event.getOrderId());
        kafkaTemplate.send(orderPaidTopic, event.getOrderId(), event);
    }
}
