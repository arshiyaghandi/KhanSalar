package com.khansalar.billing.domain;

import com.khansalar.common.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("payment_records")
public class PaymentRecord {
    @Id
    private Long id;

    @Column("invoice_id")
    private Long invoiceId;

    @Column("amount")
    private BigDecimal amount;

    @Column("payment_method")
    private PaymentMethod paymentMethod;

    @Column("tracking_code")
    private String trackingCode;

    @Column("cashier_name")
    private String cashierName;

    @Column("paid_at")
    private Instant paidAt;
}
