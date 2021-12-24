// Imports
const express = require("express");
const path = require("path");
const app = express();
const { Pool } = require("pg");
require('dotenv').config();

// Setup postgresql connection pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DB,
    password: process.env.PSQL_PASS,
    port: process.env.PSQL_PORT,
});

// Setup postgresql pool error handling
pool.on('error', (err, client) => {
    console.error('PSQL Error: ', err);
});

// Function to check for new users, sign them up as needed, and return their info
// const checkNewUser = async (email:string, name:string, picture:string) => {
const checkNewUser = async (email, name, picture) => {
    // Check if user is new to the server
    const client = await pool.connect();
    let res;
    try {
        const selquery = `SELECT id FROM users WHERE email = '${email}';`;
        res = await client.query(selquery);
    } catch (err) {
        console.error(err.stack);
        client.end();
        return; // redirect to error page
    }
    
    // Get id if found
    let id = undefined;
    if (res && res.rowCount > 0) id = res.rows[0].id;

    // If res.rowCount is 0 (id not found), this is new user, add to table
    if (res && res.rowCount === 0) {
        res = undefined;
        try {
            const insquery = `INSERT INTO users(email, name, picture) VALUES('${email}', '${name}', '${picture}') RETURNING id;`;
            res = await client.query(insquery);
        } catch (err) {
            console.error(err.stack);
            client.end();
            return; // redirect to error page
        }

        // Use id
        if (res && res.rowCount > 0) id = res.rows[0].id;
    }
    
    // // Query for all profile information given id
    let data = undefined;
    try {
        const sel2query = `SELECT * FROM users WHERE id=${id};`;
        res = await client.query(sel2query);
        if (res && res.rowCount > 0) data = res.rows[0];
    } catch (err) {
        console.error(err.stack);
        client.end();
        return; // redirect to error page
    }

    // Close client connection
    client.end();

    // Return result (object filled with user info)
    return data;
};

// Static serving
app.use(express.static(path.join(__dirname, "build")));

// Auth route (handle user signup and login)
app.get("/auth", function (req, res) {
    let email = 'manlylvrby@gmail.com';
    let name = 'Nick Olson';
    let picture = 'https://lh3.googleusercontent.com/a-/AOh14GhE2iifMP8RZC5cGP1SWFG3Qhi-9u3DnMfirUnD=s96-c';

    checkNewUser(email, name, picture).then( (data) => {
        console.log(data);
    });

    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Index route to compiled website
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Listen for requests
const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;
app.listen(PORT);
console.log(`Listening on port ${PORT}`);
