package com.khansalar.common.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GuestOrderRequest {
    @NotNull(message = "Table number or ID is required")
    private String tableNumber;

    private String customerName;
    private String customerPhone;
    private String notes;

    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDto> items;
}
