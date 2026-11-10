package com.khansalar.billing.controller;

import com.khansalar.billing.domain.DailyClosing;
import com.khansalar.billing.service.LedgerService;
import com.khansalar.common.dto.ApiResponse;
import com.khansalar.common.dto.LedgerEntryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/ledger")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    @GetMapping
    public Flux<LedgerEntryDto> getAllLedgerEntries() {
        return ledgerService.getAllLedgerEntriesWithItems();
    }

    @PostMapping("/close-day")
    public Mono<ApiResponse<DailyClosing>> closeDay(
            @RequestParam String closingDate,
            @RequestParam(defaultValue = "Floor Manager") String closedBy) {
        return ledgerService.closeDay(closingDate, closedBy)
                .map(closing -> ApiResponse.ok("Daily accounts closed and balanced successfully", closing));
    }
}
