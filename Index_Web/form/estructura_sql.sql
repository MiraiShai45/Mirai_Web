CREATE DATABASE IF NOT EXISTS inumorph_db;
USE inumorph_db;

CREATE TABLE IF NOT EXISTS commissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    preferred_datetime VARCHAR(30) NULL,
    item_quantity INT DEFAULT 1,
    phone VARCHAR(30) NOT NULL,
    service_type VARCHAR(80) NOT NULL,
    specifications TEXT NOT NULL,
    attachment_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
