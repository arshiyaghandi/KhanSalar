package com.khansalar.order.repository;

import com.khansalar.common.enums.OrderStatus;
import com.khansalar.order.domain.Order;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface OrderRepository extends ReactiveCrudRepository<Order, Long> {
    Mono<Order> findByOrderNumber(String orderNumber);
    Flux<Order> findByTableIdAndStatusNot(Long tableId, OrderStatus status);
    Flux<Order> findByStatus(OrderStatus status);
}
