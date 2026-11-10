package com.khansalar.billing.domain;

import com.khansalar.common.enums.InvoiceStatus;
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
@Table("invoices")
public class Invoice {
    @Id
    private Long id;

    @Column("invoice_number")
    private String invoiceNumber;

    @Column("order_id")
    private String orderId;

    @Column("sub_total")
    private BigDecimal subTotal;

    @Column("tax_amount")
    private BigDecimal taxAmount;

    @Column("service_fee")
    private BigDecimal serviceFee;

    @Column("discount_amount")
    private BigDecimal discountAmount;

    @Column("final_amount")
    private BigDecimal finalAmount;

    @Column("status")
    private InvoiceStatus status;

    @Column("issued_at")
    private Instant issuedAt;

    @Column("paid_at")
    private Instant paidAt;
}
