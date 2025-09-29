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