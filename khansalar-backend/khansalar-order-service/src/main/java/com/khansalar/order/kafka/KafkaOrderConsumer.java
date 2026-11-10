package com.khansalar.order.kafka;

import com.khansalar.common.events.OrderPaidEvent;
import com.khansalar.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaOrderConsumer {

    private final OrderService orderService;

    @KafkaListener(topics = "${khansalar.kafka.topics.order-paid:khansalar.order.paid}", groupId = "khansalar-order-group")
    public void onOrderPaid(OrderPaidEvent event) {
        log.info("Received OrderPaidEvent in Order Consumer [OrderId: {}, Amount: {}]", event.getOrderId(), event.getPaidAmount());
        try {
            orderService.handleOrderPaidNotification(event.getOrderId())
                    .doOnSuccess(unused -> log.info("Successfully updated order {} to PAID and marked table as EMPTY", event.getOrderId()))
                    .doOnError(err -> log.error("Failed to update order status upon receiving OrderPaidEvent", err))
                    .block(Duration.ofSeconds(15));
        } catch (Exception ex) {
            log.error("Fatal failure updating order status for OrderId {}: {}", event.getOrderId(), ex.getMessage(), ex);
            throw ex;
        }
    }
}
