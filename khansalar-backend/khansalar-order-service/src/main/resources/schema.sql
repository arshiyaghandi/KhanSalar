-- Restaurant and Cafe Tables
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id BIGSERIAL PRIMARY KEY,
    table_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 4,
    status VARCHAR(50) DEFAULT 'EMPTY', -- EMPTY, OCCUPIED, RESERVED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Food & Beverage Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers and Loyalty Club
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    loyalty_points INT DEFAULT 0,
    total_spent DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    table_id BIGINT,
    table_name VARCHAR(100),
    server_name VARCHAR(100),
    customer_id BIGINT,
    customer_name VARCHAR(120),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    notes VARCHAR(255)
);

-- Reservations and VIP Bookings
CREATE TABLE IF NOT EXISTS reservations (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    table_id BIGINT REFERENCES restaurant_tables(id) ON DELETE SET NULL,
    table_name VARCHAR(100),
    reservation_date VARCHAR(30) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    guest_count INT NOT NULL DEFAULT 2,
    occasion VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    deposit_amount DECIMAL(15, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial seed data
INSERT INTO restaurant_tables (table_number, title, capacity, status)
VALUES 
    ('T-01', 'Hafez Table', 4, 'EMPTY'),
    ('T-02', 'Saadi Table', 2, 'EMPTY'),
    ('T-03', 'Rumi Table', 6, 'EMPTY'),
    ('T-04', 'VIP Royal Booth', 8, 'EMPTY')
ON CONFLICT (table_number) DO NOTHING;

INSERT INTO menu_items (name, category, price, description, is_available)
VALUES 
    ('Special Saffron Kebab', 'Main Dish', 480000.00, 'Prime lamb kebab with premium saffron rice', TRUE),
    ('Zereshk Polo with Chicken', 'Main Dish', 340000.00, 'Braised chicken with barberries and saffron rice', TRUE),
    ('Traditional Dizi Stew', 'Main Dish', 390000.00, 'Slow cooked lamb stew with chickpeas, beans and spices', TRUE),
    ('Herbal Saffron Cooler', 'Cold Drink', 85000.00, 'Chilled herbal beverage with rosewater and chia seeds', TRUE),
    ('Persian Black Tea Pot', 'Hot Drink', 75000.00, 'Brewed tea infused with cardamom and fresh baklava', TRUE),
    ('Pistachio Baklava', 'Dessert', 120000.00, 'Traditional layered pastry filled with fresh pistachios', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO customers (phone_number, full_name, loyalty_points, total_spent)
VALUES 
    ('09121112233', 'Ali Alavi (VIP Member)', 450, 4850000.00),
    ('09123334455', 'Sara Mohammadi', 120, 1280000.00),
    ('09198887766', 'Reza Hosseini', 80, 890000.00)
ON CONFLICT (phone_number) DO NOTHING;

INSERT INTO reservations (customer_name, customer_phone, table_id, table_name, reservation_date, time_slot, guest_count, occasion, status, deposit_amount, notes)
VALUES
    ('Dr. Rezaei (VIP)', '09121118899', 4, 'VIP Royal Booth', '1403/08/25', '20:30-22:30', 6, 'VIP_GUEST', 'CONFIRMED', 500000.00, 'VIP banquet setup with saffron welcome tea'),
    ('Mrs. Tehrani', '09127776655', 1, 'Hafez Table', '1403/08/25', '19:00-21:00', 4, 'BIRTHDAY', 'CONFIRMED', 300000.00, 'Birthday table decoration with baklava platter')
ON CONFLICT DO NOTHING;
