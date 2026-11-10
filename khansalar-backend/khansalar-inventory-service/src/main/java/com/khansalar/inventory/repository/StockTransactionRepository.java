package com.khansalar.inventory.repository;

import com.khansalar.inventory.domain.StockTransaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface StockTransactionRepository extends ReactiveCrudRepository<StockTransaction, Long> {
    Flux<StockTransaction> findByInventoryItemId(Long inventoryItemId);
}
