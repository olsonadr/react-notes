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
const http = require("http").createServer(app);
const io = require("socket.io")(http, {});

// PostgreSQL Requires
const { Pool } = require("pg");

// Get psql helper to get user's data given Auth0 values (name, email, picture)
const { checkNewUser } = require(path.join(__dirname, "server_src/auth_checkNewUser.ts"));

// Setup postgresql connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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
        if (msg && msg.email && msg.name && msg.user_id) {
            let picture = msg.picture ? msg.picture : "https://i.ibb.co/k4zLTbW/176-1760995-png-file-svg-user-icon-free-copyright-transparent.jpg";
            checkNewUser(msg.email, msg.name, picture, msg.user_id, pool)
            .then((data) => {
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
const PORT = process.env.PORT || process.env.REACT_APP_PORT || 3000;
http.listen(PORT, () => {
    console.log(`Listening for socket communication on port ${PORT}`);
});