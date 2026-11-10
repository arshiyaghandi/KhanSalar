package com.khansalar.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BiSummaryDto {
    private BigDecimal totalRevenue;
    private BigDecimal estimatedFoodCost;
    private BigDecimal grossProfit;
    private Double foodCostPercentage;
    private BigDecimal averageTicketSize;
    private Integer totalOrdersCount;
    private Integer activeTablesCount;
    private Double seatTurnoverRate;
    private String peakHoursSlot;
    private Map<String, Integer> hourlyOrderDensity;
    private List<MenuEngineeringItemDto> topStars;
}
