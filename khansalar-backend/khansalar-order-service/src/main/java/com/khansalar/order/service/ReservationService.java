package com.khansalar.order.service;

import com.khansalar.common.dto.ReservationDto;
import com.khansalar.common.enums.OccasionType;
import com.khansalar.common.enums.ReservationStatus;
import com.khansalar.order.domain.Reservation;
import com.khansalar.order.repository.ReservationRepository;
import com.khansalar.order.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;

    public Flux<ReservationDto> getAllReservations() {
        return reservationRepository.findAll().map(this::toDto);
    }

    public Flux<ReservationDto> getReservationsByDate(String reservationDate) {
        return reservationRepository.findByReservationDate(reservationDate).map(this::toDto);
    }

    @Transactional
    public Mono<ReservationDto> createReservation(ReservationDto dto) {
        log.info("Creating reservation for: {} on date: {}", dto.getCustomerName(), dto.getReservationDate());

        if (dto.getCustomerName() == null || dto.getCustomerName().trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Customer name is required"));
        }
        if (dto.getCustomerPhone() == null || dto.getCustomerPhone().trim().isEmpty()) {
            return Mono.error(new IllegalArgumentException("Customer phone is required"));
        }

        Mono<String> tableNameMono = dto.getTableId() != null
                ? tableRepository.findById(dto.getTableId()).map(t -> t.getTitle() != null ? t.getTitle() : "Table " + t.getTableNumber()).defaultIfEmpty("Table " + dto.getTableId())
                : Mono.just(dto.getTableName() != null ? dto.getTableName() : "Standard Table");

        return tableNameMono.flatMap(tableName -> {
            Reservation entity = Reservation.builder()
                    .customerName(dto.getCustomerName())
                    .customerPhone(dto.getCustomerPhone())
                    .tableId(dto.getTableId())
                    .tableName(tableName)
                    .reservationDate(dto.getReservationDate())
                    .timeSlot(dto.getTimeSlot() != null ? dto.getTimeSlot() : "20:00-22:00")
                    .guestCount(dto.getGuestCount() != null && dto.getGuestCount() > 0 ? dto.getGuestCount() : 2)
                    .occasion(dto.getOccasion() != null ? dto.getOccasion() : OccasionType.GENERAL)
                    .status(dto.getStatus() != null ? dto.getStatus() : ReservationStatus.CONFIRMED)
                    .depositAmount(dto.getDepositAmount() != null ? dto.getDepositAmount() : BigDecimal.ZERO)
                    .notes(dto.getNotes())
                    .createdAt(Instant.now())
                    .build();

            return reservationRepository.save(entity)
                    .flatMap(saved -> {
                        if (saved.getTableId() != null && saved.getStatus() == ReservationStatus.CONFIRMED) {
                            return tableRepository.findById(saved.getTableId())
                                    .flatMap(t -> {
                                        t.setStatus("RESERVED");
                                        return tableRepository.save(t);
                                    })
                                    .thenReturn(toDto(saved));
                        }
                        return Mono.just(toDto(saved));
                    });
        });
    }

    @Transactional
    public Mono<ReservationDto> updateStatus(Long reservationId, ReservationStatus newStatus) {
        return reservationRepository.findById(reservationId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Reservation not found with id: " + reservationId)))
                .flatMap(reservation -> {
                    reservation.setStatus(newStatus);
                    return reservationRepository.save(reservation)
                            .flatMap(saved -> syncTableStatusForReservation(saved, newStatus).thenReturn(toDto(saved)));
                });
    }

    private Mono<Void> syncTableStatusForReservation(Reservation reservation, ReservationStatus status) {
        if (reservation.getTableId() == null) {
            return Mono.empty();
        }
        if (status == ReservationStatus.SEATED) {
            return tableRepository.findById(reservation.getTableId())
                    .flatMap(t -> {
                        t.setStatus("OCCUPIED");
                        return tableRepository.save(t);
                    }).then();
        } else if (status == ReservationStatus.CANCELLED || status == ReservationStatus.NO_SHOW) {
            return tableRepository.findById(reservation.getTableId())
                    .flatMap(t -> {
                        t.setStatus("EMPTY");
                        return tableRepository.save(t);
                    }).then();
        }
        return Mono.empty();
    }

    private ReservationDto toDto(Reservation r) {
        return ReservationDto.builder()
                .id(r.getId())
                .customerName(r.getCustomerName())
                .customerPhone(r.getCustomerPhone())
                .tableId(r.getTableId())
                .tableName(r.getTableName())
                .reservationDate(r.getReservationDate())
                .timeSlot(r.getTimeSlot())
                .guestCount(r.getGuestCount())
                .occasion(r.getOccasion())
                .status(r.getStatus())
                .depositAmount(r.getDepositAmount())
                .notes(r.getNotes())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
