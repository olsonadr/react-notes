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
const PORT = (process.env.SEPARATE_PROCESSES ? process.env.SERVER_DEV_PORT : undefined)
    || process.env.PORT
    || 3000;
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

// Get addNewNote helper to add a new note to the notes table and return its note_id, or null on failure
const { addNewNote } = require(path.join(__dirname, "server_src/db_addNewNote.ts"));

// Get getUID helper to get the u_id of a user from their user_id, or null on failure
const { getUID } = require(path.join(__dirname, "server_src/auth_getUID.ts"));

// Get getProfile helper to get the profile of a user from their u_id, or null on failure
const { getProfile } = require(path.join(__dirname, "server_src/auth_getProfile.ts"));

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
    console.log('Client connected, sending confirmation')
    socket.emit('connected', {});
    // (() => { })(); // do nothing placeholder

    // Handler for receiving user authentication message
    socket.on('profile_request', (msg) => {
        // Handle auth message here (if payload given)
        let logMsg = "";
        logMsg += 'Received profile request';
        if (msg && msg.email && msg.name && msg.user_id) {
            logMsg += ` for auth'd user ${msg.name} w/ supposed id ${msg.user_id}, checking if they are in the users database...`;
            let picture = msg.picture ? msg.picture : "https://i.ibb.co/k4zLTbW/176-1760995-png-file-svg-user-icon-free-copyright-transparent.jpg";
            checkNewUser(msg.email, msg.name, picture, msg.user_id, pool, getUID, getProfile)
                .then((data) => {
                    if (data) logMsg += ` and they belong in database so sending profile response to them!\n`;
                    else logMsg += ` and they don't belong in database so sending them no data!\n`;
                    socket.emit('profile_response', data);
                    console.log(logMsg);
                });
        } else {
            logMsg += ' but the request was malformed (didn\'t include email, name, and user_id), ignoring!';
            console.log(logMsg);
        }
    });

    // Handler for request to add new note to server
    socket.on('add_note', async (msg) => {
        console.log('Received add_note request!');
        // If payload given, attempt to create new note, give back note_id for new note
        if (msg && msg.name && msg.data !== null && msg.user_id) {
            // Insert new note into DB and get its note_id
            const { user_id, name, data } = msg;
            const u_id = await getUID(user_id, pool);
            const note_id = await addNewNote(u_id, name, data, pool);
            const profile = await getProfile(u_id, pool);
            
            console.log('Emitting profile_refresh and note_redirect responses!');
            // Return a response message to refresh user profile with new profile
            socket.emit('profile_refresh', profile);
            // Return a response message to redirect to the note_id of the new note
            socket.emit('note_redirect', {note_id: note_id});
            
        }
    });

    // Handler for disconnecting socket.io client
    socket.on('disconnect', () => {
        // Handle client disconnect here
        (() => { })(); // do nothing placeholder
    });
});

// Listen for socket.io and react requests on same port
if (process.env.SEPARATE_PROCESSES === 'true') {
    // Listens for socket comms on express server
    //  (requires static serving of react app via other means like `npm start`)
    io.listen(PORT, () => { });
    console.log(`Listening for socket requests on port ${PORT}\n`);
} else {
    // Renders static, built react app and listens for socket comms on same express server
    //  (requires `npm run build` before usage)
    http.listen(PORT, () => {
        console.log(`Listening for react and socket requests on port ${PORT}\n`);
    });
}