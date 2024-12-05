DROP DATABASE IF EXISTS restaurants_data;

CREATE DATABASE IF NOT EXISTS restaurants_data;

USE restaurants_data;

CREATE TABLE IF NOT EXISTS restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    rating VARCHAR(255) NOT NULL DEFAULT '0',
    category VARCHAR(255) NOT NULL,
    price VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL UNIQUE
);

ALTER TABLE restaurants
ADD CONSTRAINT unique_restaurant UNIQUE (address, city, province);
