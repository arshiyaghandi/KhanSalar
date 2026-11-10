package com.khansalar.common.events;

import com.khansalar.common.dto.OrderItemDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderPlacedEvent {
    private String orderId;
    private String orderNumber;
    private Long tableId;
    private String tableName;
    private String serverName;
    private Long customerId;
    private String customerName;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private Instant createdAt;
}
