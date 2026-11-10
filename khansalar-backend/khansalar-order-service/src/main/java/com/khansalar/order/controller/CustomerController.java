package com.khansalar.order.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.order.domain.Customer;
import com.khansalar.order.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Instant;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping
    public Flux<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/phone/{phoneNumber}")
    public Mono<ResponseEntity<ApiResponse<Customer>>> getCustomerByPhone(@PathVariable String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber)
                .map(customer -> ResponseEntity.ok(ApiResponse.ok(customer)))
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Customer not found with phone: " + phoneNumber)));
    }

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<Customer>>> createCustomer(@RequestBody Customer customer) {
        if (customer.getPhoneNumber() == null || customer.getPhoneNumber().trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body(ApiResponse.error("Phone number is required")));
        }
        if (customer.getFullName() == null || customer.getFullName().trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body(ApiResponse.error("Full name is required")));
        }

        customer.setCreatedAt(Instant.now());
        if (customer.getLoyaltyPoints() == null) {
            customer.setLoyaltyPoints(50); // 50 Welcome bonus loyalty points
        }
        if (customer.getTotalSpent() == null) {
            customer.setTotalSpent(BigDecimal.ZERO);
        }

        return customerRepository.findByPhoneNumber(customer.getPhoneNumber())
                .flatMap(existing -> Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                        .<ApiResponse<Customer>>body(ApiResponse.error("A customer with this phone number already exists"))))
                .switchIfEmpty(customerRepository.save(customer)
                        .map(saved -> ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.ok("Customer created successfully", saved))));
    }
}
