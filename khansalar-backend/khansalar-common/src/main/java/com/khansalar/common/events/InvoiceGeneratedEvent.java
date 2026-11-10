package com.khansalar.common.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceGeneratedEvent {
    private String invoiceId;
    private String invoiceNumber;
    private String orderId;
    private BigDecimal subTotal;
    private BigDecimal taxAmount;
    private BigDecimal serviceFee;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private Instant issuedAt;
}
