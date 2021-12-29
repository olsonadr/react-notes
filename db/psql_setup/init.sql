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


-- -- Initialization of notes table for react-notes app
-- Delete if exists
-- DROP TABLE IF EXISTS notes;
-- Create notes table
CREATE TABLE notes (
    u_id INTEGER NOT NULL,
    note_id SERIAL NOT NULL,
    name VARCHAR(200) NOT NULL,
    data TEXT,
    PRIMARY KEY(u_id, note_id)
);


-- -- Initialization of helper convert_to_integer function
-- --   Source: https://stackoverflow.com/questions/2082686/how-do-i-cast-a-string-to-integer-and-have-0-in-case-of-error-in-the-cast-with-p
CREATE OR REPLACE FUNCTION convert_to_integer(v_input text)
RETURNS INTEGER AS $$
DECLARE v_int_value INTEGER DEFAULT NULL;
BEGIN
    BEGIN
        v_int_value := v_input::INTEGER;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Invalid integer value: "%".  Returning NULL.', v_input;
        RETURN NULL;
    END;
RETURN v_int_value;
END;
$$ LANGUAGE plpgsql;


-- -- Initialization of add_note function for react-notes app
-- Create or replace function to add a new note with given name and body, returning it's ID
--  (replaced notes with taken names with first available integer value appended)
CREATE OR REPLACE FUNCTION add_note (
        IN u_id_in INTEGER,
        IN name_in VARCHAR (200),
        IN data_in TEXT,
        OUT note_id_out INTEGER
    ) AS $$
    DECLARE
        name_count INTEGER;
        dup_name_count INTEGER;
        new_name TEXT;
        max_suffix INTEGER DEFAULT NULL;
    BEGIN
        -- Check if name taken and if there exist duplicate names
        SELECT COUNT(name) INTO name_count FROM notes WHERE name = name_in;

        -- If not taken, then use given name to insert new note later
        IF name_count = 0 THEN
            new_name := name_in;

        -- Else find next available name
        ELSE
            -- -- Gets all names that are like the provided name but with a space an numbers following
            -- SELECT name FROM notes WHERE name LIKE ('new note' || ' %');
            -- -- Gets the suffix of all such names
            -- SELECT RIGHT(name, -1*CHAR_LENGTH('new note')) FROM notes WHERE name LIKE ('new note' || ' %');

            -- -- Get the max_suffix in db
            WITH note_suffixes (suffix) AS (
                    SELECT convert_to_integer(RIGHT(name, -1*CHAR_LENGTH(name_in))) AS suffix FROM notes WHERE name LIKE (name_in || ' %') AND u_id = u_id_in
            )
            SELECT MAX(suffix) INTO max_suffix FROM note_suffixes;

            -- -- Gets the highest lowest non-taken suffix existing in the database for name name_in
            SELECT (name_in || ' ' || suffix::text) AS new_name
            INTO new_name
            FROM (
                WITH note_suffixes (suffix) AS (
                    SELECT convert_to_integer(RIGHT(name, -1*CHAR_LENGTH(name_in))) AS suffix FROM notes WHERE name LIKE (name_in || ' %') AND u_id = u_id_in
                )
                SELECT generate_series(1, max_suffix) as suffix EXCEPT SELECT suffix FROM note_suffixes
            ) s
            ORDER BY suffix
            LIMIT 1;
        END IF;


        -- If no name was found, then there were no duplicates with numbers, so use 1
        new_name := COALESCE(new_name, (name_in || ' ' || (COALESCE(max_suffix, 0)+1)::TEXT));

        RAISE NOTICE 'max_suffix = %;', max_suffix;
        RAISE NOTICE 'COALESCE(max_suffix, 1) = %;', COALESCE(max_suffix, 0)+1;
        RAISE NOTICE 'new_name = %;', new_name;

        -- Insert new note into DB using decided name and return it's ID
        INSERT INTO notes (u_id, name, data) VALUES (u_id_in, new_name, data_in) RETURNING note_id INTO note_id_out;
    END;
    $$ LANGUAGE plpgsql;

