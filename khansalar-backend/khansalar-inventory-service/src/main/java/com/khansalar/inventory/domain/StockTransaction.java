package com.khansalar.inventory.domain;

import com.khansalar.common.enums.StockTransactionType;
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
@Table("stock_transactions")
public class StockTransaction {
    @Id
    private Long id;

    @Column("inventory_item_id")
    private Long inventoryItemId;

    @Column("transaction_type")
    private StockTransactionType transactionType;

    @Column("quantity")
    private BigDecimal quantity;

    @Column("unit_cost")
    private BigDecimal unitCost;

    @Column("total_cost")
    private BigDecimal totalCost;

    @Column("reference_id")
    private String referenceId;

    @Column("notes")
    private String notes;

    @Column("created_at")
    private Instant createdAt;
}
