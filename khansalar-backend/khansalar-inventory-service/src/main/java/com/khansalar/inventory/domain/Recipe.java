package com.khansalar.inventory.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("recipes")
public class Recipe {
    @Id
    private Long id;

    @Column("menu_item_id")
    private Long menuItemId;

    @Column("menu_item_name")
    private String menuItemName;

    @Column("inventory_item_id")
    private Long inventoryItemId;

    @Column("required_quantity")
    private BigDecimal requiredQuantity;
}
