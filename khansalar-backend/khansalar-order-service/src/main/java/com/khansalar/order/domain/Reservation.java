package com.khansalar.order.domain;

import com.khansalar.common.enums.OccasionType;
import com.khansalar.common.enums.ReservationStatus;
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
@Table("reservations")
public class Reservation {
    @Id
    private Long id;

    @Column("customer_name")
    private String customerName;

    @Column("customer_phone")
    private String customerPhone;

    @Column("table_id")
    private Long tableId;

    @Column("table_name")
    private String tableName;

    @Column("reservation_date")
    private String reservationDate;

    @Column("time_slot")
    private String timeSlot;

    @Column("guest_count")
    private Integer guestCount;

    @Column("occasion")
    private OccasionType occasion;

    @Column("status")
    private ReservationStatus status;

    @Column("deposit_amount")
    private BigDecimal depositAmount;

    @Column("notes")
    private String notes;

    @Column("created_at")
    private Instant createdAt;
}
