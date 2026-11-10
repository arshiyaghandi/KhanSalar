package com.khansalar.billing.controller;

import com.khansalar.billing.domain.Invoice;
import com.khansalar.billing.dto.PayInvoiceRequest;
import com.khansalar.billing.service.BillingService;
import com.khansalar.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final BillingService billingService;

    @GetMapping
    public Flux<Invoice> getAllInvoices() {
        return billingService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public Mono<ApiResponse<Invoice>> getInvoiceById(@PathVariable Long id) {
        return billingService.getInvoiceById(id)
                .map(ApiResponse::ok);
    }

    @PostMapping("/{id}/pay")
    public Mono<ApiResponse<Invoice>> payInvoice(@PathVariable Long id, @Valid @RequestBody PayInvoiceRequest request) {
        return billingService.payInvoice(id, request)
                .map(invoice -> ApiResponse.ok("Invoice paid successfully and ledger entry recorded", invoice));
    }
}
