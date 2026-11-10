package com.khansalar.common.dto;

import com.khansalar.common.enums.OccasionType;
import com.khansalar.common.enums.ReservationStatus;
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
public class ReservationDto {
    private Long id;
    private String customerName;
    private String customerPhone;
    private Long tableId;
    private String tableName;
    private String reservationDate; // Jalali or standard YYYY-MM-DD
    private String timeSlot;        // e.g. "13:00-15:00" or "20:30-22:30"
    private Integer guestCount;
    private OccasionType occasion;
    private ReservationStatus status;
    private BigDecimal depositAmount;
    private String notes;
    private Instant createdAt;
}
