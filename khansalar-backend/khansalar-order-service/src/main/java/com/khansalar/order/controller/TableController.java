package com.khansalar.order.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.order.domain.RestaurantTable;
import com.khansalar.order.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/tables")
@RequiredArgsConstructor
public class TableController {

    private final RestaurantTableRepository tableRepository;

    @GetMapping
    public Flux<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @PostMapping
    public Mono<ApiResponse<RestaurantTable>> createTable(@RequestBody RestaurantTable table) {
        table.setCreatedAt(Instant.now());
        if (table.getStatus() == null) {
            table.setStatus("EMPTY");
        }
        return tableRepository.save(table)
                .map(saved -> ApiResponse.ok("Table created successfully", saved));
    }
}
