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

// // Index route to compiled website
// app.get("/", function (req, res) {
//     res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// Listen for static requests to render react
const REACT_PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
app.listen(REACT_PORT, () => {
    console.log(`Listening for react app rendering on port ${REACT_PORT}`);
});


// ----------------------------------------------------------------------
// Socket.io Backend
// ----------------------------------------------------------------------

// Socket.io Requires
const SOCK_PORT = process.env.REACT_APP_SOCK_PORT || process.env.SOCK_SERVER_PORT || 4000;
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    // cors: { methods: ["GET", "POST"] }, // needed when not using websocket
});

// PostgreSQL Requires
const { Pool } = require("pg");

// Get psql helper to get user's data given Auth0 values (name, email, picture)
const { checkNewUser } = require(path.join(__dirname, "server_src/auth_checkNewUser.ts"));

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

// Listen for socket.io requests to backend
io.listen(SOCK_PORT, () => { });
console.log(`Listening for socket communication on port ${SOCK_PORT}`);