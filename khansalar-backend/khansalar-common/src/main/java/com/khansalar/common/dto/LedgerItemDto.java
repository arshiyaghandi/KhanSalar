package com.khansalar.common.dto;

import com.khansalar.common.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LedgerItemDto {
    private Long id;
    private String accountName;
    private AccountType accountType;
    private BigDecimal debit;
    private BigDecimal credit;
}
