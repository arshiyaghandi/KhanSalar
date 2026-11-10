package com.khansalar.billing.domain;

import com.khansalar.common.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("ledger_items")
public class LedgerItem {
    @Id
    private Long id;

    @Column("ledger_entry_id")
    private Long ledgerEntryId;

    @Column("account_name")
    private String accountName;

    @Column("account_type")
    private AccountType accountType;

    @Column("debit")
    private BigDecimal debit;   // بدهکار

    @Column("credit")
    private BigDecimal credit;  // بستانکار
}
