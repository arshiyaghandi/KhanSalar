package com.khansalar.order.repository;

import com.khansalar.order.domain.MenuItem;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface MenuItemRepository extends ReactiveCrudRepository<MenuItem, Long> {
    Flux<MenuItem> findByCategory(String category);
    Flux<MenuItem> findByIsAvailableTrue();
}
