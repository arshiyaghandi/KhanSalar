package com.khansalar.billing.repository;

import com.khansalar.billing.domain.LedgerEntry;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface LedgerEntryRepository extends ReactiveCrudRepository<LedgerEntry, Long> {
    Mono<LedgerEntry> findByEntryNumber(String entryNumber);
}
