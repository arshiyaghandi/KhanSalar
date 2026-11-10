package com.khansalar.order.kafka;

import com.khansalar.common.events.OrderPaidEvent;
import com.khansalar.common.events.OrderPlacedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaOrderProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${khansalar.kafka.topics.order-placed:khansalar.order.placed}")
    private String orderPlacedTopic;

    @Value("${khansalar.kafka.topics.order-paid:khansalar.order.paid}")
    private String orderPaidTopic;

    public void publishOrderPlaced(OrderPlacedEvent event) {
        log.info("Publishing OrderPlacedEvent to Kafka [OrderNumber: {}, Topic: {}]", event.getOrderNumber(), orderPlacedTopic);
        kafkaTemplate.send(orderPlacedTopic, event.getOrderId(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("OrderPlacedEvent successfully published to Kafka [Offset: {}]", result.getRecordMetadata().offset());
                    } else {
                        log.error("Failed to publish OrderPlacedEvent to Kafka", ex);
                    }
                });
    }

    public void publishOrderPaid(OrderPaidEvent event) {
        log.info("Publishing OrderPaidEvent to Kafka [OrderId: {}, Topic: {}]", event.getOrderId(), orderPaidTopic);
        kafkaTemplate.send(orderPaidTopic, event.getOrderId(), event);
    }
}
