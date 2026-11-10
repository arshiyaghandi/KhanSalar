package com.khansalar.order.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.common.enums.OrderStatus;
import com.khansalar.order.dto.OrderResponse;
import com.khansalar.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/kitchen")
@RequiredArgsConstructor
public class KitchenController {

    private final OrderService orderService;

    /**
     * Returns all active kitchen orders currently being prepared or queued
     */
    @GetMapping("/orders")
    public Flux<OrderResponse> getActiveKitchenOrders() {
        return orderService.getAllOrders()
                .filter(o -> o.getStatus() == OrderStatus.PENDING 
                          || o.getStatus() == OrderStatus.CONFIRMED 
                          || o.getStatus() == OrderStatus.PREPARING);
    }

    /**
     * Updates order status from kitchen display (e.g. mark READY or PREPARING)
     */
    @PatchMapping("/orders/{id}/status")
    public Mono<ApiResponse<String>> updateKitchenStatus(
            @PathVariable Long id, 
            @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(id, status)
                .then(Mono.just(ApiResponse.ok("Kitchen order status updated to " + status.name(), status.name())));
    }
}
