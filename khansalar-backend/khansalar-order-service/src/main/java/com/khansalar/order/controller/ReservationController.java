package com.khansalar.order.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.common.dto.ReservationDto;
import com.khansalar.common.enums.ReservationStatus;
import com.khansalar.order.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public Flux<ReservationDto> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/date/{date}")
    public Flux<ReservationDto> getReservationsByDate(@PathVariable String date) {
        return reservationService.getReservationsByDate(date);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<ApiResponse<ReservationDto>> createReservation(@Valid @RequestBody ReservationDto dto) {
        return reservationService.createReservation(dto)
                .map(created -> ApiResponse.ok("Reservation registered successfully", created));
    }

    @PatchMapping("/{id}/status")
    public Mono<ApiResponse<ReservationDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {
        return reservationService.updateStatus(id, status)
                .map(updated -> ApiResponse.ok("Reservation status updated to " + status.name(), updated));
    }
}
