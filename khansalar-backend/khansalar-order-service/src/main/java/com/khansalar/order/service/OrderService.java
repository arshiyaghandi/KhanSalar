package com.khansalar.order.service;

import com.khansalar.common.dto.OrderItemDto;
import com.khansalar.common.enums.OrderStatus;
import com.khansalar.common.events.OrderPlacedEvent;
import com.khansalar.order.domain.Customer;
import com.khansalar.order.domain.Order;
import com.khansalar.order.domain.OrderItem;
import com.khansalar.order.domain.RestaurantTable;
import com.khansalar.order.dto.CreateOrderRequest;
import com.khansalar.order.dto.OrderResponse;
import com.khansalar.order.kafka.KafkaOrderProducer;
import com.khansalar.order.repository.CustomerRepository;
import com.khansalar.order.repository.MenuItemRepository;
import com.khansalar.order.repository.OrderItemRepository;
import com.khansalar.order.repository.OrderRepository;
import com.khansalar.order.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestaurantTableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;
    private final CustomerRepository customerRepository;
    private final KafkaOrderProducer kafkaProducer;
    private final ReactiveRedisTemplate<String, Object> redisTemplate;

    private static final String ACTIVE_ORDER_KEY_PREFIX = "khansalar:order:active:";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Transactional
    public Mono<OrderResponse> createOrder(CreateOrderRequest request) {
        log.info("Creating new order for table ID: {}", request.getTableId());

        if (request.getItems() == null || request.getItems().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Order must contain at least one item"));
        }

        return tableRepository.findById(request.getTableId())
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Table not found with id: " + request.getTableId())))
                .flatMap(table -> {
                    Mono<Customer> customerMono = request.getCustomerId() != null
                            ? customerRepository.findById(request.getCustomerId()).defaultIfEmpty(new Customer())
                            : Mono.just(new Customer());

                    return customerMono.flatMap(customer -> {
                        String customerName = customer.getId() != null ? customer.getFullName() : null;

                        return Flux.fromIterable(request.getItems())
                                .concatMap(itemReq -> {
                                    if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                                        return Mono.error(new IllegalArgumentException("Item quantity must be strictly positive"));
                                    }
                                    return menuItemRepository.findById(itemReq.getMenuItemId())
                                            .switchIfEmpty(Mono.error(new IllegalArgumentException("Menu item not found with id: " + itemReq.getMenuItemId())))
                                            .map(menuItem -> {
                                                BigDecimal unitPrice = menuItem.getPrice();
                                                BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
                                                return OrderItem.builder()
                                                        .menuItemId(menuItem.getId())
                                                        .itemName(menuItem.getName())
                                                        .quantity(itemReq.getQuantity())
                                                        .unitPrice(unitPrice)
                                                        .totalPrice(totalPrice)
                                                        .notes(itemReq.getNotes())
                                                        .build();
                                            });
                                })
                                .collectList()
                                .flatMap(orderItems -> {
                                    BigDecimal totalAmount = orderItems.stream()
                                            .map(OrderItem::getTotalPrice)
                                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                                    // Generate high-entropy unique order number
                                    int randomSuffix = 1000 + SECURE_RANDOM.nextInt(9000);
                                    String orderNumber = "KH-" + System.currentTimeMillis() + "-" + randomSuffix;

                                    Order order = Order.builder()
                                            .orderNumber(orderNumber)
                                            .tableId(table.getId())
                                            .tableName(table.getTitle() != null ? table.getTitle() : "Table " + table.getTableNumber())
                                            .serverName(request.getServerName() != null ? request.getServerName() : "Central Desk")
                                            .customerId(customer.getId())
                                            .customerName(customerName)
                                            .status(OrderStatus.PENDING)
                                            .totalAmount(totalAmount)
                                            .notes(request.getNotes())
                                            .createdAt(Instant.now())
                                            .updatedAt(Instant.now())
                                            .build();

                                    return orderRepository.save(order)
                                            .flatMap(savedOrder -> {
                                                orderItems.forEach(item -> item.setOrderId(savedOrder.getId()));
                                                return orderItemRepository.saveAll(orderItems)
                                                        .collectList()
                                                        .flatMap(savedItems -> {
                                                            table.setStatus("OCCUPIED");
                                                            return tableRepository.save(table)
                                                                    .flatMap(savedTable -> {
                                                                        List<OrderItemDto> itemDtos = savedItems.stream()
                                                                                .map(i -> OrderItemDto.builder()
                                                                                        .menuItemId(i.getMenuItemId())
                                                                                        .itemName(i.getItemName())
                                                                                        .quantity(i.getQuantity())
                                                                                        .unitPrice(i.getUnitPrice())
                                                                                        .totalPrice(i.getTotalPrice())
                                                                                        .notes(i.getNotes())
                                                                                        .build())
                                                                                .toList();

                                                                        OrderPlacedEvent event = OrderPlacedEvent.builder()
                                                                                .orderId(savedOrder.getId().toString())
                                                                                .orderNumber(savedOrder.getOrderNumber())
                                                                                .tableId(savedOrder.getTableId())
                                                                                .tableName(savedOrder.getTableName())
                                                                                .serverName(savedOrder.getServerName())
                                                                                .customerId(savedOrder.getCustomerId())
                                                                                .customerName(savedOrder.getCustomerName())
                                                                                .items(itemDtos)
                                                                                .totalAmount(savedOrder.getTotalAmount())
                                                                                .discountAmount(BigDecimal.ZERO)
                                                                                .createdAt(savedOrder.getCreatedAt())
                                                                                .build();

                                                                        kafkaProducer.publishOrderPlaced(event);

                                                                        OrderResponse response = OrderResponse.builder()
                                                                                .id(savedOrder.getId())
                                                                                .orderNumber(savedOrder.getOrderNumber())
                                                                                .tableId(savedOrder.getTableId())
                                                                                .tableName(savedOrder.getTableName())
                                                                                .serverName(savedOrder.getServerName())
                                                                                .customerId(savedOrder.getCustomerId())
                                                                                .customerName(savedOrder.getCustomerName())
                                                                                .status(savedOrder.getStatus())
                                                                                .totalAmount(savedOrder.getTotalAmount())
                                                                                .notes(savedOrder.getNotes())
                                                                                .items(itemDtos)
                                                                                .createdAt(savedOrder.getCreatedAt())
                                                                                .updatedAt(savedOrder.getUpdatedAt())
                                                                                .build();

                                                                        // Clean reactive chaining for Redis key without dangling .subscribe()
                                                                        return redisTemplate.opsForValue()
                                                                                .set(ACTIVE_ORDER_KEY_PREFIX + savedOrder.getId(), savedOrder.getOrderNumber(), Duration.ofHours(6))
                                                                                .thenReturn(response);
                                                                    });
                                                        });
                                            });
                                });
                    });
                });
    }

    public Flux<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .flatMap(order -> orderItemRepository.findByOrderId(order.getId())
                        .map(i -> OrderItemDto.builder()
                                .menuItemId(i.getMenuItemId())
                                .itemName(i.getItemName())
                                .quantity(i.getQuantity())
                                .unitPrice(i.getUnitPrice())
                                .totalPrice(i.getTotalPrice())
                                .notes(i.getNotes())
                                .build())
                        .collectList()
                        .map(items -> OrderResponse.builder()
                                .id(order.getId())
                                .orderNumber(order.getOrderNumber())
                                .tableId(order.getTableId())
                                .tableName(order.getTableName())
                                .serverName(order.getServerName())
                                .customerId(order.getCustomerId())
                                .customerName(order.getCustomerName())
                                .status(order.getStatus())
                                .totalAmount(order.getTotalAmount())
                                .notes(order.getNotes())
                                .items(items)
                                .createdAt(order.getCreatedAt())
                                .updatedAt(order.getUpdatedAt())
                                .build()
                        ));
    }

    public Mono<OrderResponse> getOrderById(Long id) {
        return orderRepository.findById(id)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Order not found with id: " + id)))
                .flatMap(order -> orderItemRepository.findByOrderId(order.getId())
                        .map(i -> OrderItemDto.builder()
                                .menuItemId(i.getMenuItemId())
                                .itemName(i.getItemName())
                                .quantity(i.getQuantity())
                                .unitPrice(i.getUnitPrice())
                                .totalPrice(i.getTotalPrice())
                                .notes(i.getNotes())
                                .build())
                        .collectList()
                        .map(items -> OrderResponse.builder()
                                .id(order.getId())
                                .orderNumber(order.getOrderNumber())
                                .tableId(order.getTableId())
                                .tableName(order.getTableName())
                                .serverName(order.getServerName())
                                .customerId(order.getCustomerId())
                                .customerName(order.getCustomerName())
                                .status(order.getStatus())
                                .totalAmount(order.getTotalAmount())
                                .notes(order.getNotes())
                                .items(items)
                                .createdAt(order.getCreatedAt())
                                .updatedAt(order.getUpdatedAt())
                                .build()));
    }

    @Transactional
    public Mono<Void> updateOrderStatus(Long orderId, OrderStatus newStatus) {
        return orderRepository.findById(orderId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Order not found with id: " + orderId)))
                .flatMap(order -> {
                    order.setStatus(newStatus);
                    order.setUpdatedAt(Instant.now());

                    Mono<Void> tableUpdateMono = Mono.empty();
                    if (newStatus == OrderStatus.PAID || newStatus == OrderStatus.CANCELLED) {
                        tableUpdateMono = tableRepository.findById(order.getTableId())
                                .flatMap(table -> {
                                    table.setStatus("EMPTY");
                                    return tableRepository.save(table);
                                })
                                .then(redisTemplate.delete(ACTIVE_ORDER_KEY_PREFIX + orderId).then());
                    }

                    return orderRepository.save(order).then(tableUpdateMono);
                });
    }

    @Transactional
    public Mono<Void> handleOrderPaidNotification(String orderIdStr) {
        try {
            Long orderId = Long.parseLong(orderIdStr);
            log.info("Processing order paid event for Order ID: {}", orderId);
            return updateOrderStatus(orderId, OrderStatus.PAID);
        } catch (NumberFormatException e) {
            log.warn("Invalid order id received in OrderPaidEvent: {}", orderIdStr);
            return Mono.empty();
        }
    }
}
