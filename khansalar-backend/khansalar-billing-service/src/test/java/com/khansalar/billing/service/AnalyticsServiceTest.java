package com.khansalar.billing.service;

import com.khansalar.billing.domain.Invoice;
import com.khansalar.billing.repository.InvoiceRepository;
import com.khansalar.common.dto.BiSummaryDto;
import com.khansalar.common.dto.MenuEngineeringItemDto;
import com.khansalar.common.enums.InvoiceStatus;
import com.khansalar.common.enums.MenuClassification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    @DisplayName("getBiSummary should return valid BI metrics including salesByCategory and hourlyOrderDensity")
    void testGetBiSummary() {
        Invoice invoice1 = Invoice.builder()
                .id(1L)
                .invoiceNumber("INV-001")
                .orderId("ORD-001")
                .finalAmount(BigDecimal.valueOf(1000000))
                .status(InvoiceStatus.PAID)
                .issuedAt(Instant.now())
                .build();

        Invoice invoice2 = Invoice.builder()
                .id(2L)
                .invoiceNumber("INV-002")
                .orderId("ORD-002")
                .finalAmount(BigDecimal.valueOf(2000000))
                .status(InvoiceStatus.PAID)
                .issuedAt(Instant.now())
                .build();

        when(invoiceRepository.findAll()).thenReturn(Flux.just(invoice1, invoice2));

        StepVerifier.create(analyticsService.getBiSummary())
                .assertNext(summary -> {
                    assertThat(summary).isNotNull();
                    assertThat(summary.getTotalRevenue()).isEqualByComparingTo(BigDecimal.valueOf(3000000));
                    assertThat(summary.getTotalOrdersCount()).isEqualTo(2);
                    assertThat(summary.getAverageTicketSize()).isEqualByComparingTo(BigDecimal.valueOf(1500000));
                    assertThat(summary.getHourlyOrderDensity()).isNotEmpty();
                    assertThat(summary.getSalesByCategory()).isNotEmpty();
                    assertThat(summary.getSalesByCategory()).hasSize(5);
                    assertThat(summary.getSalesByCategory().getFirst().getCategory()).contains("Main Dish");
                    assertThat(summary.getTopStars()).isNotNull();
                })
                .verifyComplete();
    }

    @Test
    @DisplayName("getMenuEngineering should return categorized dishes across all 4 BCG quadrants")
    void testGetMenuEngineering() {
        StepVerifier.create(analyticsService.getMenuEngineering().collectList())
                .assertNext(items -> {
                    assertThat(items).isNotEmpty();
                    assertThat(items).anyMatch(i -> i.getClassification() == MenuClassification.STAR);
                    assertThat(items).anyMatch(i -> i.getClassification() == MenuClassification.PLOWHORSE);
                    assertThat(items).anyMatch(i -> i.getClassification() == MenuClassification.PUZZLE);
                    assertThat(items).anyMatch(i -> i.getClassification() == MenuClassification.DOG);
                })
                .verifyComplete();
    }
}
