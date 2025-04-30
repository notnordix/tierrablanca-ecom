-- Create the database
CREATE DATABASE IF NOT EXISTS tierrablanca;
USE tierrablanca;

-- Enable UUID functions
SET GLOBAL log_bin_trust_function_creators = 1;

-- Create UUID function if not exists
DELIMITER //
CREATE FUNCTION IF NOT EXISTS uuid_to_bin(_uuid CHAR(36))
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
    RETURN UNHEX(REPLACE(_uuid, '-', ''));
END //
DELIMITER ;

-- Admin users table (removed email field)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Replace this line in your schema.sql
-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_description VARCHAR(255) NOT NULL,
    full_description TEXT NOT NULL,
    price VARCHAR(50) NOT NULL,
    main_image VARCHAR(255) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product materials table (one-to-many)
CREATE TABLE IF NOT EXISTS product_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    material VARCHAR(100) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_material (product_id, material)
);

-- Product sizes table (one-to-many)
CREATE TABLE IF NOT EXISTS product_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_size (product_id, size)
);

-- Product colors table (one-to-many)
CREATE TABLE IF NOT EXISTS product_colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_color (product_id, color)
);

-- Product images table (one-to-many)
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order items table (one-to-many)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    size VARCHAR(50) NULL,
    color VARCHAR(50) NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE NO ACTION
);

-- View counter table
CREATE TABLE IF NOT EXISTS view_counter (
    id INT PRIMARY KEY DEFAULT 1,
    count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (id = 1)
);

-- Insert initial view count
INSERT INTO view_counter (id, count) VALUES (1, 0)
ON DUPLICATE KEY UPDATE id = id;

-- Create indexes for better performance
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Create a procedure to increment view count
DELIMITER //
CREATE PROCEDURE increment_view_count()
BEGIN
    UPDATE view_counter SET count = count + 1 WHERE id = 1;
END //
DELIMITER ;
