package com.khansalar.order.domain;

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
@Table("customers")
public class Customer {
    @Id
    private Long id;

    @Column("phone_number")
    private String phoneNumber;

    @Column("full_name")
    private String fullName;

    @Column("loyalty_points")
    private Integer loyaltyPoints;

    @Column("total_spent")
    private BigDecimal totalSpent;

    @Column("created_at")
    private Instant createdAt;
}
