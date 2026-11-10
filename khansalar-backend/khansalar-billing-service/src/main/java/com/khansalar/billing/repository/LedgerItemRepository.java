package com.khansalar.billing.repository;

import com.khansalar.billing.domain.LedgerItem;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface LedgerItemRepository extends ReactiveCrudRepository<LedgerItem, Long> {
    Flux<LedgerItem> findByLedgerEntryId(Long ledgerEntryId);
}
