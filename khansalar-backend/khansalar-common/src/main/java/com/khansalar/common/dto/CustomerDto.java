package com.khansalar.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {
    private Long id;
    private String phoneNumber;
    private String fullName;
    private Integer loyaltyPoints;
    private BigDecimal totalSpent;
}
