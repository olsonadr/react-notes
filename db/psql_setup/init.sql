-- -- Initialization of users table for react-notes app
-- Write-able transaction
set transaction read write; 
-- Delete if exists
-- DROP TABLE IF EXISTS users;
-- Create users table
CREATE TABLE users (
    u_id SERIAL UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50),
    picture VARCHAR(2083),
    user_id VARCHAR(50) NOT NULL PRIMARY KEY
);

-- Delete if exists
-- DROP TABLE IF EXISTS notes;
-- Create notes table
CREATE TABLE notes (
    u_id VARCHAR(50) NOT NULL,
    note_id SERIAL NOT NULL,
    name VARCHAR(200) NOT NULL,
    data TEXT,
    PRIMARY KEY(u_id, note_id)
);
