package com.khansalar.inventory.repository;

import com.khansalar.inventory.domain.InventoryItem;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface InventoryItemRepository extends ReactiveCrudRepository<InventoryItem, Long> {
    Mono<InventoryItem> findByItemCode(String itemCode);
}
