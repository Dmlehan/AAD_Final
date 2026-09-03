-- V1__init_schema.sql
-- Sun Baby English Student Management System
-- Baseline Schema Setup

CREATE TABLE IF NOT EXISTS system_metadata (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_key VARCHAR(100) NOT NULL UNIQUE,
    property_value TEXT NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO system_metadata (property_key, property_value, description)
VALUES ('system.name', 'Sun Baby English Student Management System', 'System Application Name'),
       ('system.version', '1.0.0', 'Current System Version'),
       ('payment.mode', 'OFFLINE_MANUAL', 'Online gateways disabled. Manual offline tracking with WhatsApp receipts.')
ON DUPLICATE KEY UPDATE property_value = VALUES(property_value);
