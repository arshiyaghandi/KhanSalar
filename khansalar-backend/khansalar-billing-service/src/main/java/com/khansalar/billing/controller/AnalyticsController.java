package com.khansalar.billing.controller;

import com.khansalar.billing.service.AnalyticsService;
import com.khansalar.common.dto.ApiResponse;
import com.khansalar.common.dto.BiSummaryDto;
import com.khansalar.common.dto.MenuEngineeringItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public Mono<ApiResponse<BiSummaryDto>> getBiSummary() {
        return analyticsService.getBiSummary()
                .map(ApiResponse::ok);
    }

    @GetMapping("/menu-engineering")
    public Flux<MenuEngineeringItemDto> getMenuEngineering() {
        return analyticsService.getMenuEngineering();
    }
}
