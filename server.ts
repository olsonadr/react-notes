// ----------------------------------------------------------------------
// General Setup
// ----------------------------------------------------------------------

// General Requires
const express = require("express");
const path = require("path");
const app = express();


// ----------------------------------------------------------------------
// Static Serving of React App
// ----------------------------------------------------------------------

// Get environment variables from .env file 
require('dotenv').config();

// Static serving
app.use(express.static(path.join(__dirname, "build")));


// ----------------------------------------------------------------------
// Socket.io Backend
// ----------------------------------------------------------------------

// Socket.io Requires
const PORT = process.env.PORT || process.env.REACT_APP_PORT || 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: [
            `http://localhost:${PORT}`,
            'react-notes-nerd.herokuapp.com'
        ],
    }
});

// PostgreSQL Requires
const { Pool } = require("pg");

// Get psql helper to get user's data given Auth0 values (name, email, picture)
const { checkNewUser } = require(path.join(__dirname, "server_src/auth_checkNewUser.ts"));

// Setup postgresql connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.DATABASE_URL_DEV,
    ssl: process.env.DATABASE_URL ? {
        rejectUnauthorized: false
    } : false
});

// Setup postgresql pool error handling
pool.on('error', (err, client) => {
    console.error('PSQL Error: ', err);
});

// Handler for connected socket.io clients
io.on('connection', (socket) => {
    // Handle new client connection here
    (() => { })(); // do nothing placeholder

    // Handler for receiving user authentication message
    socket.on('profile_request', (msg) => {
        // Handle auth message here (if payload given)
        console.log('Received profile request;');
        if (msg && msg.email && msg.name && msg.user_id) {
            console.log(` for auth'd user ${msg.name} w/ supposed id ${msg.user_id}, checking if they are in the users database;`);
            let picture = msg.picture ? msg.picture : "https://i.ibb.co/k4zLTbW/176-1760995-png-file-svg-user-icon-free-copyright-transparent.jpg";
            checkNewUser(msg.email, msg.name, picture, msg.user_id, pool)
                .then((data) => {
                    if (data) console.log(` they belong in database, sending profile response to them!\n`);
                    else console.log(` they don't belong in database, sending them no data!\n`);
                    socket.emit('profile_response', data);
                });
        }
    });

    // Handler for disconnecting socket.io client
    socket.on('disconnect', () => {
        // Handle client disconnect here
        (() => { })(); // do nothing placeholder
    });
});

// Listen for socket.io and react requests on same port
http.listen(PORT, () => {
    console.log(`Listening for react and socket requests on port ${PORT}\n`);
});