-- Migration: Add store_name column to expenses table
-- Date: 2026-01-30

ALTER TABLE `expenses` 
ADD COLUMN `store_name` VARCHAR(100) DEFAULT NULL AFTER `description`;

-- Optional: Add an index for faster searching by store name
CREATE INDEX `idx_store_name` ON `expenses`(`store_name`);
