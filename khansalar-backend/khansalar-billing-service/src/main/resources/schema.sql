-- Sales and Service Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    order_id VARCHAR(100) NOT NULL,
    sub_total DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    service_fee DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'ISSUED', -- DRAFT, ISSUED, PAID, VOID
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_records (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- CASH, CARD_POS, ONLINE, WALLET
    tracking_code VARCHAR(100),
    cashier_name VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- General Ledger / Journal Entries (Double-entry accounting)
CREATE TABLE IF NOT EXISTS ledger_entries (
    id BIGSERIAL PRIMARY KEY,
    entry_number VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    reference_type VARCHAR(50) NOT NULL, -- INVOICE, EXPENSE, DAILY_CLOSING
    reference_id VARCHAR(100),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ledger Items (Debit / Credit)
CREATE TABLE IF NOT EXISTS ledger_items (
    id BIGSERIAL PRIMARY KEY,
    ledger_entry_id BIGINT NOT NULL REFERENCES ledger_entries(id) ON DELETE CASCADE,
    account_name VARCHAR(150) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    debit DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    credit DECIMAL(15, 2) NOT NULL DEFAULT 0.00
);

-- Daily Closings & Balance Settlement
CREATE TABLE IF NOT EXISTS daily_closings (
    id BIGSERIAL PRIMARY KEY,
    closing_date VARCHAR(50) NOT NULL UNIQUE,
    total_sales DECIMAL(15, 2) NOT NULL,
    total_cash DECIMAL(15, 2) NOT NULL,
    total_pos DECIMAL(15, 2) NOT NULL,
    total_tax DECIMAL(15, 2) NOT NULL,
    order_count INT NOT NULL,
    closed_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
