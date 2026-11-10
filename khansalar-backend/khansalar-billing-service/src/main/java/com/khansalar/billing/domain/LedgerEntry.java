package com.khansalar.billing.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("ledger_entries")
public class LedgerEntry {
    @Id
    private Long id;

    @Column("entry_number")
    private String entryNumber;

    @Column("description")
    private String description;

    @Column("reference_type")
    private String referenceType; // INVOICE, EXPENSE, DAILY_CLOSING

    @Column("reference_id")
    private String referenceId;

    @Column("transaction_date")
    private Instant transactionDate;
}
