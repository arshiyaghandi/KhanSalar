package com.khansalar.inventory.service;

import com.khansalar.common.enums.StockTransactionType;
import com.khansalar.common.events.OrderPlacedEvent;
import com.khansalar.common.events.StockAlertEvent;
import com.khansalar.inventory.domain.InventoryItem;
import com.khansalar.inventory.domain.Recipe;
import com.khansalar.inventory.domain.StockTransaction;
import com.khansalar.inventory.repository.InventoryItemRepository;
import com.khansalar.inventory.repository.RecipeRepository;
import com.khansalar.inventory.repository.StockTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final RecipeRepository recipeRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Flux<InventoryItem> getAllInventoryItems() {
        return inventoryItemRepository.findAll();
    }

    @Transactional
    public Mono<InventoryItem> recordPurchase(Long itemId, BigDecimal quantity, BigDecimal unitCost, String notes) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            return Mono.error(new IllegalArgumentException("Purchase quantity must be strictly positive"));
        }
        if (unitCost == null || unitCost.compareTo(BigDecimal.ZERO) < 0) {
            return Mono.error(new IllegalArgumentException("Unit cost cannot be negative"));
        }

        return inventoryItemRepository.findById(itemId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Inventory item not found: " + itemId)))
                .flatMap(item -> {
                    BigDecimal currentStock = item.getCurrentStock() != null ? item.getCurrentStock() : BigDecimal.ZERO;
                    BigDecimal newStock = currentStock.add(quantity);
                    item.setCurrentStock(newStock);
                    item.setUnitCost(unitCost);
                    item.setUpdatedAt(Instant.now());

                    StockTransaction tx = StockTransaction.builder()
                            .inventoryItemId(item.getId())
                            .transactionType(StockTransactionType.PURCHASE)
                            .quantity(quantity)
                            .unitCost(unitCost)
                            .totalCost(quantity.multiply(unitCost))
                            .notes(notes)
                            .createdAt(Instant.now())
                            .build();

                    return inventoryItemRepository.save(item)
                            .flatMap(savedItem -> stockTransactionRepository.save(tx).thenReturn(savedItem));
                });
    }

    /**
     * Automated Recipe Deduction when OrderPlacedEvent arrives from Kafka.
     * Prevents race conditions and lost updates by aggregating total consumed
     * quantities per inventory item before executing atomic sequential deductions.
     */
    @Transactional
    public Mono<Void> deductStockForOrder(OrderPlacedEvent event) {
        log.info("Processing automated inventory deduction for Order: {}", event.getOrderNumber());

        if (event.getItems() == null || event.getItems().isEmpty()) {
            return Mono.empty();
        }

        return Flux.fromIterable(event.getItems())
                .concatMap(orderItem -> {
                    int qty = orderItem.getQuantity() != null && orderItem.getQuantity() > 0 ? orderItem.getQuantity() : 1;
                    return recipeRepository.findByMenuItemId(orderItem.getMenuItemId())
                            .map(recipe -> new ConsumedIngredient(
                                    recipe.getInventoryItemId(),
                                    recipe.getRequiredQuantity().multiply(BigDecimal.valueOf(qty)),
                                    orderItem.getItemName()
                            ));
                })
                .groupBy(ConsumedIngredient::inventoryItemId)
                .flatMap(groupedFlux -> groupedFlux.reduce((a, b) -> new ConsumedIngredient(
                        a.inventoryItemId(),
                        a.quantity().add(b.quantity()),
                        a.dishNames() + ", " + b.dishNames()
                )))
                .concatMap(consumed -> inventoryItemRepository.findById(consumed.inventoryItemId())
                        .flatMap(invItem -> {
                            BigDecimal currentStock = invItem.getCurrentStock() != null ? invItem.getCurrentStock() : BigDecimal.ZERO;
                            BigDecimal updatedStock = currentStock.subtract(consumed.quantity());
                            invItem.setCurrentStock(updatedStock);
                            invItem.setUpdatedAt(Instant.now());

                            BigDecimal unitCost = invItem.getUnitCost() != null ? invItem.getUnitCost() : BigDecimal.ZERO;
                            StockTransaction tx = StockTransaction.builder()
                                    .inventoryItemId(invItem.getId())
                                    .transactionType(StockTransactionType.CONSUMPTION)
                                    .quantity(consumed.quantity())
                                    .unitCost(unitCost)
                                    .totalCost(consumed.quantity().multiply(unitCost))
                                    .referenceId(event.getOrderNumber())
                                    .notes("Consumed for: " + consumed.dishNames())
                                    .createdAt(Instant.now())
                                    .build();

                            // Check low-stock threshold
                            BigDecimal minStock = invItem.getMinimumStock() != null ? invItem.getMinimumStock() : BigDecimal.ZERO;
                            if (updatedStock.compareTo(minStock) <= 0) {
                                log.warn("LOW STOCK ALERT: Item {} has reached {} {}", 
                                        invItem.getName(), updatedStock, invItem.getUnit());

                                StockAlertEvent alert = StockAlertEvent.builder()
                                        .inventoryItemId(invItem.getId())
                                        .itemCode(invItem.getItemCode())
                                        .itemName(invItem.getName())
                                        .currentStock(updatedStock)
                                        .minimumStock(minStock)
                                        .unit(invItem.getUnit())
                                        .alertTime(Instant.now())
                                        .build();

                                kafkaTemplate.send("khansalar.stock.alert", alert);
                            }

                            return inventoryItemRepository.save(invItem)
                                    .then(stockTransactionRepository.save(tx));
                        })
                )
                .then();
    }

    public Flux<Recipe> getRecipesForMenuItem(Long menuItemId) {
        return recipeRepository.findByMenuItemId(menuItemId);
    }

    public Mono<Recipe> saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    private record ConsumedIngredient(Long inventoryItemId, BigDecimal quantity, String dishNames) {}
}
