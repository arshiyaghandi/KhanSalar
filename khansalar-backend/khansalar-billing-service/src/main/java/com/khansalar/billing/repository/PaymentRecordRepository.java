package com.khansalar.billing.repository;

import com.khansalar.billing.domain.PaymentRecord;
import com.khansalar.common.enums.PaymentMethod;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface PaymentRecordRepository extends ReactiveCrudRepository<PaymentRecord, Long> {
    Flux<PaymentRecord> findByInvoiceId(Long invoiceId);
    Flux<PaymentRecord> findByPaymentMethod(PaymentMethod paymentMethod);
}
