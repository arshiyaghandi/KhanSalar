package com.khansalar.common.dto;

import com.khansalar.common.enums.MenuClassification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuEngineeringItemDto {
    private Long menuItemId;
    private String itemName;
    private String category;
    private BigDecimal sellingPrice;
    private BigDecimal foodCost;
    private BigDecimal grossMargin;
    private Double foodCostPercentage;
    private Integer unitsSold;
    private BigDecimal totalRevenue;
    private MenuClassification classification;
}
