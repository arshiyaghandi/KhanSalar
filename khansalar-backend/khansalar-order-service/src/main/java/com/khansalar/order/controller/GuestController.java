package com.khansalar.order.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.common.dto.GuestOrderRequest;
import com.khansalar.common.dto.OrderItemDto;
import com.khansalar.order.domain.MenuItem;
import com.khansalar.order.domain.RestaurantTable;
import com.khansalar.order.dto.CreateOrderRequest;
import com.khansalar.order.dto.OrderResponse;
import com.khansalar.order.repository.MenuItemRepository;
import com.khansalar.order.repository.RestaurantTableRepository;
import com.khansalar.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/guest")
@RequiredArgsConstructor
public class GuestController {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final OrderService orderService;

    @GetMapping("/menu")
    public Flux<MenuItem> getGuestMenu() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    @GetMapping("/table/{tableNumber}")
    public Mono<ApiResponse<RestaurantTable>> getTableByNumber(@PathVariable String tableNumber) {
        return tableRepository.findAll()
                .filter(t -> t.getTableNumber().equalsIgnoreCase(tableNumber) || String.valueOf(t.getId()).equals(tableNumber))
                .next()
                .map(ApiResponse::ok)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Table not found with number or id: " + tableNumber)));
    }

    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<OrderResponse>> placeGuestOrder(@Valid @RequestBody GuestOrderRequest request) {
        log.info("Received guest order from table: {}", request.getTableNumber());

        return tableRepository.findAll()
                .filter(t -> t.getTableNumber().equalsIgnoreCase(request.getTableNumber()) || String.valueOf(t.getId()).equals(request.getTableNumber()))
                .next()
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Table not found: " + request.getTableNumber())))
                .flatMap(table -> {
                    List<CreateOrderRequest.CreateOrderItemRequest> itemRequests = request.getItems().stream()
                            .map(i -> CreateOrderRequest.CreateOrderItemRequest.builder()
                                    .menuItemId(i.getMenuItemId())
                                    .quantity(i.getQuantity())
                                    .notes(i.getNotes())
                                    .build())
                            .toList();

                    CreateOrderRequest createRequest = CreateOrderRequest.builder()
                            .tableId(table.getId())
                            .serverName("Guest Self-Order (QR)")
                            .notes(request.getNotes() != null && !request.getNotes().isEmpty()
                                    ? "Guest Note: " + request.getNotes()
                                    : "Guest Self-Order via QR")
                            .items(itemRequests)
                            .build();

                    return orderService.createOrder(createRequest)
                            .map(order -> ApiResponse.ok("Order received! Kitchen preparing your meal", order));
                });
    }

    @PostMapping("/call-waiter")
    public Mono<ApiResponse<Map<String, String>>> callWaiter(
            @RequestParam String tableNumber,
            @RequestParam(defaultValue = "SERVICE") String reason) {
        log.info("Guest requested assistance for table {}: {}", tableNumber, reason);
        return Mono.just(ApiResponse.ok("Waiter has been notified and is coming to table " + tableNumber, 
                Map.of("table", tableNumber, "status", "CALLED", "reason", reason)));
    }
}
