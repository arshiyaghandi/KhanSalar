package com.khansalar.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAlertEvent {
    private Long inventoryItemId;
    private String itemCode;
    private String itemName;
    private BigDecimal currentStock;
    private BigDecimal minimumStock;
    private String unit;
    private Instant alertTime;
}
