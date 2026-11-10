package com.khansalar.inventory.kafka;

import com.khansalar.common.events.OrderPlacedEvent;
import com.khansalar.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaInventoryConsumer {

    private final InventoryService inventoryService;

    @KafkaListener(topics = "${khansalar.kafka.topics.order-placed:khansalar.order.placed}", groupId = "khansalar-inventory-group")
    public void onOrderPlaced(OrderPlacedEvent event) {
        log.info("Received OrderPlacedEvent in Inventory Consumer [OrderId: {}, Number: {}]", 
                event.getOrderId(), event.getOrderNumber());
        
        try {
            inventoryService.deductStockForOrder(event)
                    .doOnSuccess(unused -> log.info("Successfully deducted inventory for order {}", event.getOrderNumber()))
                    .doOnError(err -> log.error("Failed to deduct inventory for order {}", event.getOrderNumber(), err))
                    .block(Duration.ofSeconds(15));
        } catch (Exception ex) {
            log.error("Fatal failure deducting inventory for order {}: {}", event.getOrderNumber(), ex.getMessage(), ex);
            throw ex;
        }
    }
}
