-- -- Initialization of database and table for react-notes app

-- Create react_notes database
CREATE DATABASE react_notes;

-- Create users table
CREATE TABLE users (
    id SERIAL UNIQUE,
    email VARCHAR(50) UNIQUE PRIMARY KEY,
    name VARCHAR(50),
    picture VARCHAR(100)
);
