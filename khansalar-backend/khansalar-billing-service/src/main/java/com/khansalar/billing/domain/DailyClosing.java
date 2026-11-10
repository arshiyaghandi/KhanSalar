package com.khansalar.billing.domain;

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
@Table("daily_closings")
public class DailyClosing {
    @Id
    private Long id;

    @Column("closing_date")
    private String closingDate; // تاریخ به فرمت شمسی مثلاً 1403/07/25

    @Column("total_sales")
    private BigDecimal totalSales;

    @Column("total_cash")
    private BigDecimal totalCash;

    @Column("total_pos")
    private BigDecimal totalPos;

    @Column("total_tax")
    private BigDecimal totalTax;

    @Column("order_count")
    private Integer orderCount;

    @Column("closed_by")
    private String closedBy;

    @Column("created_at")
    private Instant createdAt;
}
