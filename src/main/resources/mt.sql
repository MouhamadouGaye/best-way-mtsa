CREATE DATABASE moneytransfer;
CREATE USER moneyuser WITH ENCRYPTED PASSWORD 'money_pass';
GRANT ALL PRIVILEGES ON DATABASE moneytransfer TO moneyuser;
CREATE TABLE country_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prefix VARCHAR(10) NOT NULL,
    code VARCHAR(5) NOT NULL,
    name VARCHAR(100)
);
CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    card_number_last4 VARCHAR(4) NOT NULL,
    brand VARCHAR(50),
    expiry_month INT NOT NULL,
    expiry_year INT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
-- Step 1: Add the column as nullable
ALTER TABLE beneficiaries
ADD COLUMN country_name VARCHAR(55);
-- Step 2: Update existing rows with default values
UPDATE beneficiaries
SET country_name = 'International'
WHERE country_name IS NULL;
-- Step 3: Now make it NOT NULL
ALTER TABLE beneficiaries
ALTER COLUMN country_name
SET NOT NULL;
-- Add new columns as nullable
ALTER TABLE beneficiaries
ADD COLUMN country_name VARCHAR(55),
    ADD COLUMN currency VARCHAR(10),
    ADD COLUMN currency_symbol VARCHAR(10);
-- Update existing records with values based on country_code
UPDATE beneficiaries
SET country_name = CASE
        WHEN country_code = 'US' THEN 'United States'
        WHEN country_code = 'GB' THEN 'United Kingdom'
        WHEN country_code = 'FR' THEN 'France'
        WHEN country_code = 'DE' THEN 'Germany'
        WHEN country_code = 'CI' THEN 'Côte d''Ivoire'
        WHEN country_code = 'NG' THEN 'Nigeria'
        ELSE 'International'
    END,
    currency = CASE
        WHEN country_code = 'US' THEN 'USD'
        WHEN country_code = 'GB' THEN 'GBP'
        WHEN country_code IN ('FR', 'DE') THEN 'EUR'
        WHEN country_code = 'CI' THEN 'XOF'
        WHEN country_code = 'NG' THEN 'NGN'
        ELSE 'USD'
    END,
    currency_symbol = CASE
        WHEN country_code = 'US' THEN '$'
        WHEN country_code = 'GB' THEN '£'
        WHEN country_code IN ('FR', 'DE') THEN '€'
        WHEN country_code = 'CI' THEN 'CFA'
        WHEN country_code = 'NG' THEN '₦'
        ELSE '$'
    END;
-- Now make columns NOT NULL
ALTER TABLE beneficiaries
ALTER COLUMN country_name
SET NOT NULL,
    ALTER COLUMN currency
SET NOT NULL,
    ALTER COLUMN currency_symbol
SET NOT NULL;
-- Commit the transaction
COMMIT;