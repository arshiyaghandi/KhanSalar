package com.khansalar.common.events;

import com.khansalar.common.enums.PaymentMethod;
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
public class OrderPaidEvent {
    private String orderId;
    private String invoiceId;
    private BigDecimal paidAmount;
    private PaymentMethod paymentMethod;
    private String trackingCode;
    private String cashierName;
    private Instant paidAt;
}
