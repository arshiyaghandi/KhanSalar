package com.khansalar.billing.repository;

import com.khansalar.billing.domain.DailyClosing;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface DailyClosingRepository extends ReactiveCrudRepository<DailyClosing, Long> {
    Mono<DailyClosing> findByClosingDate(String closingDate);
}
