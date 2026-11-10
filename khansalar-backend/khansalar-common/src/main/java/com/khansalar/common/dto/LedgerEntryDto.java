package com.khansalar.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LedgerEntryDto {
    private Long id;
    private String entryNumber;
    private String description;
    private String referenceType;
    private String referenceId;
    private Instant transactionDate;
    private List<LedgerItemDto> items;
}
