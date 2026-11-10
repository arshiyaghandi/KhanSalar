package com.khansalar.order.repository;

import com.khansalar.common.enums.ReservationStatus;
import com.khansalar.order.domain.Reservation;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ReservationRepository extends ReactiveCrudRepository<Reservation, Long> {
    Flux<Reservation> findByReservationDate(String reservationDate);
    Flux<Reservation> findByStatus(ReservationStatus status);
    Flux<Reservation> findByTableId(Long tableId);
}
