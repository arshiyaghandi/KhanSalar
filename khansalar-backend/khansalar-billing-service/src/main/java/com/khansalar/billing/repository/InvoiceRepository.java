package com.khansalar.billing.repository;

import com.khansalar.billing.domain.Invoice;
import com.khansalar.common.enums.InvoiceStatus;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface InvoiceRepository extends ReactiveCrudRepository<Invoice, Long> {
    Mono<Invoice> findByInvoiceNumber(String invoiceNumber);
    Mono<Invoice> findByOrderId(String orderId);
    Flux<Invoice> findByStatus(InvoiceStatus status);
}
