-- Raw Materials and Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGSERIAL PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    unit VARCHAR(30) NOT NULL, -- KG, G, L, ML, PCS
    current_stock DECIMAL(15, 3) NOT NULL DEFAULT 0.000,
    minimum_stock DECIMAL(15, 3) NOT NULL DEFAULT 0.000,
    unit_cost DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recipe Formulation / Bill of Materials (BOM) for each Menu Item
CREATE TABLE IF NOT EXISTS recipes (
    id BIGSERIAL PRIMARY KEY,
    menu_item_id BIGINT NOT NULL,
    menu_item_name VARCHAR(150) NOT NULL,
    inventory_item_id BIGINT NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    required_quantity DECIMAL(15, 3) NOT NULL -- Quantity of raw material consumed per 1 dish
);

-- Inventory Stock Transactions (Auditable Ledger for Inventory)
CREATE TABLE IF NOT EXISTS stock_transactions (
    id BIGSERIAL PRIMARY KEY,
    inventory_item_id BIGINT NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- PURCHASE, CONSUMPTION, WASTE, ADJUSTMENT
    quantity DECIMAL(15, 3) NOT NULL,
    unit_cost DECIMAL(15, 2) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    reference_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Raw Materials for Khansalar Restaurant & Cafe
INSERT INTO inventory_items (item_code, name, unit, current_stock, minimum_stock, unit_cost)
VALUES 
    ('RAW-LAMB', 'Fresh Lamb Loin', 'KG', 45.500, 15.000, 580000.00),
    ('RAW-RICE', 'Premium Saffron Rice', 'KG', 120.000, 30.000, 110000.00),
    ('RAW-SAFFRON', 'Qayen Pure Saffron', 'G', 450.000, 100.000, 95000.00),
    ('RAW-BUTTER', 'Traditional Churned Butter', 'KG', 22.000, 5.000, 240000.00),
    ('RAW-CHICKEN', 'Fresh Chicken Fillet', 'KG', 35.000, 10.000, 180000.00),
    ('RAW-COFFEE', 'Arabica Espresso Beans', 'KG', 18.000, 4.000, 650000.00),
    ('RAW-ROSEWATER', 'Kashan Double Rosewater', 'L', 28.000, 8.000, 85000.00)
ON CONFLICT (item_code) DO NOTHING;

-- Initial Recipe Bill of Materials (BOM)
-- Menu Item 1: Special Saffron Kebab (menu_item_id = 1) -> 0.300 KG Lamb, 0.180 KG Rice, 2.0 G Saffron, 0.030 KG Butter
INSERT INTO recipes (menu_item_id, menu_item_name, inventory_item_id, required_quantity)
VALUES 
    (1, 'Special Saffron Kebab', 1, 0.300),
    (1, 'Special Saffron Kebab', 2, 0.180),
    (1, 'Special Saffron Kebab', 3, 2.000),
    (1, 'Special Saffron Kebab', 4, 0.030)
ON CONFLICT DO NOTHING;
