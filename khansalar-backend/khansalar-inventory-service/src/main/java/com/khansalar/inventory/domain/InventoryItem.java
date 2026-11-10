package com.khansalar.inventory.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("inventory_items")
public class InventoryItem {
    @Id
    private Long id;

    @Column("item_code")
    private String itemCode;

    @Column("name")
    private String name;

    @Column("unit")
    private String unit; // KG, G, L, ML, PCS

    @Column("current_stock")
    private BigDecimal currentStock;

    @Column("minimum_stock")
    private BigDecimal minimumStock;

    @Column("unit_cost")
    private BigDecimal unitCost;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;
}
