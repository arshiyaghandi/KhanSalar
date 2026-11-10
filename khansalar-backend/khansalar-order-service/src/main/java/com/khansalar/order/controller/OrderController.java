package com.khansalar.order.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.common.enums.OrderStatus;
import com.khansalar.order.dto.CreateOrderRequest;
import com.khansalar.order.dto.OrderResponse;
import com.khansalar.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request)
                .map(order -> ApiResponse.ok("Order created successfully", order));
    }

    @GetMapping
    public Flux<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Mono<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ApiResponse::ok);
    }

    @PatchMapping("/{id}/status")
    public Mono<ApiResponse<String>> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(id, status)
                .then(Mono.just(ApiResponse.ok("Order status updated successfully", status.name())));
    }
}
