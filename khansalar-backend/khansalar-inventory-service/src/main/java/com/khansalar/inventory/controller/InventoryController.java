package com.khansalar.inventory.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.inventory.domain.InventoryItem;
import com.khansalar.inventory.domain.Recipe;
import com.khansalar.inventory.service.InventoryService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/items")
    public Flux<InventoryItem> getAllItems() {
        return inventoryService.getAllInventoryItems();
    }

    @PostMapping("/purchase")
    public Mono<ApiResponse<InventoryItem>> recordPurchase(@RequestBody PurchaseStockRequest request) {
        return inventoryService.recordPurchase(request.getItemId(), request.getQuantity(), request.getUnitCost(), request.getNotes())
                .map(item -> ApiResponse.ok("Stock purchase recorded successfully", item));
    }

    @GetMapping("/recipes/{menuItemId}")
    public Flux<Recipe> getRecipes(@PathVariable Long menuItemId) {
        return inventoryService.getRecipesForMenuItem(menuItemId);
    }

    @PostMapping("/recipes")
    public Mono<ApiResponse<Recipe>> saveRecipe(@RequestBody Recipe recipe) {
        return inventoryService.saveRecipe(recipe)
                .map(saved -> ApiResponse.ok("Recipe formulation saved successfully", saved));
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseStockRequest {
        private Long itemId;
        private BigDecimal quantity;
        private BigDecimal unitCost;
        private String notes;
    }
}
