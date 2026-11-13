package com.khansalar.order.service;

import com.khansalar.common.dto.ReservationDto;
import com.khansalar.common.enums.OccasionType;
import com.khansalar.common.enums.ReservationStatus;
import com.khansalar.order.domain.Reservation;
import com.khansalar.order.domain.RestaurantTable;
import com.khansalar.order.repository.ReservationRepository;
import com.khansalar.order.repository.RestaurantTableRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RestaurantTableRepository tableRepository;

    @InjectMocks
    private ReservationService reservationService;

    @Test
    @DisplayName("createReservation should succeed when customerName and customerPhone are provided")
    void testCreateReservationSuccess() {
        ReservationDto dto = ReservationDto.builder()
                .customerName("Dr. Farhmand")
                .customerPhone("09121112233")
                .tableId(1L)
                .reservationDate("1403/08/25")
                .timeSlot("20:00-22:00")
                .guestCount(4)
                .occasion(OccasionType.VIP_GUEST)
                .status(ReservationStatus.CONFIRMED)
                .depositAmount(BigDecimal.valueOf(500000))
                .notes("VIP welcoming tea")
                .build();

        RestaurantTable table = RestaurantTable.builder()
                .id(1L)
                .tableNumber("T-01")
                .title("Hafez Table")
                .capacity(4)
                .status("EMPTY")
                .build();

        Reservation savedEntity = Reservation.builder()
                .id(100L)
                .customerName(dto.getCustomerName())
                .customerPhone(dto.getCustomerPhone())
                .tableId(1L)
                .tableName("Hafez Table")
                .reservationDate(dto.getReservationDate())
                .timeSlot(dto.getTimeSlot())
                .guestCount(dto.getGuestCount())
                .occasion(dto.getOccasion())
                .status(dto.getStatus())
                .depositAmount(dto.getDepositAmount())
                .notes(dto.getNotes())
                .createdAt(Instant.now())
                .build();

        when(tableRepository.findById(1L)).thenReturn(Mono.just(table));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(Mono.just(savedEntity));
        when(tableRepository.save(any(RestaurantTable.class))).thenReturn(Mono.just(table));

        StepVerifier.create(reservationService.createReservation(dto))
                .assertNext(result -> {
                    assertThat(result).isNotNull();
                    assertThat(result.getId()).isEqualTo(100L);
                    assertThat(result.getCustomerName()).isEqualTo("Dr. Farhmand");
                    assertThat(result.getCustomerPhone()).isEqualTo("09121112233");
                    assertThat(result.getOccasion()).isEqualTo(OccasionType.VIP_GUEST);
                    assertThat(result.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
                })
                .verifyComplete();
    }

    @Test
    @DisplayName("createReservation should fail when customerPhone is missing")
    void testCreateReservationMissingPhone() {
        ReservationDto dto = ReservationDto.builder()
                .customerName("Dr. Farhmand")
                .customerPhone("")
                .build();

        StepVerifier.create(reservationService.createReservation(dto))
                .expectError(IllegalArgumentException.class)
                .verify();
    }
}
