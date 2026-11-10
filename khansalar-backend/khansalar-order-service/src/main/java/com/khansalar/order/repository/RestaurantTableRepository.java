package com.khansalar.order.repository;

import com.khansalar.order.domain.RestaurantTable;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface RestaurantTableRepository extends ReactiveCrudRepository<RestaurantTable, Long> {
    Mono<RestaurantTable> findByTableNumber(String tableNumber);
    Flux<RestaurantTable> findByStatus(String status);
}
