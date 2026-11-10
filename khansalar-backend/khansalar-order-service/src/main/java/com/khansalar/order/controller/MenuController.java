package com.khansalar.order.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.order.domain.MenuItem;
import com.khansalar.order.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuItemRepository menuItemRepository;

    @GetMapping
    public Flux<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @GetMapping("/available")
    public Flux<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrue();
    }

    @PostMapping
    public Mono<ApiResponse<MenuItem>> createMenuItem(@RequestBody MenuItem item) {
        item.setCreatedAt(Instant.now());
        if (item.getIsAvailable() == null) {
            item.setIsAvailable(true);
        }
        return menuItemRepository.save(item)
                .map(saved -> ApiResponse.ok("Menu item created successfully", saved));
    }
}
