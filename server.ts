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
const { checkNewUser_client } = require(path.join(__dirname, "server_src/auth_checkNewUser.ts"));

// Get addNewNote helper to add a new note to the notes table and return its note_id, or null on failure
const { addNewNote_client } = require(path.join(__dirname, "server_src/db_addNewNote.ts"));

// Get deleteNote helper to delete a note from the notes table
const { deleteNote_client } = require(path.join(__dirname, "server_src/db_deleteNote.ts"));

// Get saveNote helper to update a note in the notes table with new info
const { saveNote_client } = require(path.join(__dirname, "server_src/db_saveNote.ts"));

// Get getUID helper to get the u_id of a user from their user_id, or null on failure
const { getUID_client } = require(path.join(__dirname, "server_src/auth_getUID.ts"));

// Get getProfile helper to get the profile of a user from their u_id, or null on failure
const { getProfile_client } = require(path.join(__dirname, "server_src/auth_getProfile.ts"));

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
io.on('connection', async (socket) => {
    // Handle new client connection here
    console.log('Client connected');
    
    // Handler for receiving user authentication message
    socket.on('profile_request', async (msg, ack) => {
        // Handle auth message here (if payload given)
        let logMsg = "";
        logMsg += 'Received profile request';
        
        if (msg && msg.email && msg.name && msg.user_id) {
            // Create psql connection for them
            pool.connect(async (err, client, done) => {
                // Handle connection errors            
                if (err) throw err;
                console.log(`Received profile request for ${ msg.name } w/ id ${ msg.user_id }...`);
                logMsg += ` for auth'd user ${msg.name} w/ supposed id ${msg.user_id}, checking if they are in the users database...`;
                let picture = msg.picture ? msg.picture : "https://i.ibb.co/k4zLTbW/176-1760995-png-file-svg-user-icon-free-copyright-transparent.jpg";

                // checkNewUser(msg.email, msg.name, picture, msg.user_id, pool, getUID, getProfile)
                const data = await checkNewUser_client(msg.email, msg.name, picture, msg.user_id, client, getUID_client, getProfile_client)

                // With response data, ack request
                if (data) logMsg += ` and they belong in database so sending profile response to them!\n`;                    
                else logMsg += ` and they don't belong in database so sending them no data!\n`;
                // console.log(logMsg);
                if (data) console.log(`... and ${msg.name} belonged in database, so sending profile response to them!\n`);
                else console.log(`... and ${msg.name} didn't belong in database, so sending them no data!\n`);
                ack(data); // ack messsage with profile data

                // Done with psql connection, pass it along
                done();
            });
        } else {
            logMsg += ' but the request was malformed (didn\'t include email, name, and user_id), ignoring!';
            console.log(logMsg);
        }
    });

    // Handler for request to add new note to server
    socket.on('add_note', async (msg, ack) => {
        console.log('Received add_note request!');
        // If payload given, attempt to create new note, give back note_id for new note
        if (msg && msg.name && msg.data !== null && msg.user_id) {
            // Get connection
            await pool.connect(async (err, client, done)=>{
                // Insert new note into DB and get its note_id
                const { user_id, name, data } = msg;
                const u_id = await getUID_client(user_id, client);
                const note_id = await addNewNote_client(u_id, name, data, client);
                const profile = await getProfile_client(u_id, client);

                // Close connection
                client.end();

                // Return a response message to refresh user profile with new profile and redirect to new note
                console.log('Emitting profile_refresh and note_redirect responses!');
                ack(profile, note_id);

                // Done with psql connection
                done();
            });
        }
    });

    // Handler for request to delete note from server
    socket.on('delete_note', async (msg, ack) => {
        console.log('Received delete_note request!');
        // If payload given, attempt to delete note
        if (msg && msg.user_id && msg.note_id) {
            // Get connection
            await pool.connect(async (err, client, done) => {
                // Remove note from DB
                const { user_id, note_id } = msg;
                const u_id = await getUID_client(user_id, client);
                await deleteNote_client(u_id, note_id, client);
                const profile = await getProfile_client(u_id, client);

                // Close connection
                done();

                // Return a response message to refresh user profile with new profile
                console.log('Emitting profile_refresh responses!');
                ack(profile);
            });
        }
    });

    // Handler for request to save the current note on client
    socket.on('save_note', async (msg, ack) => {
        console.log('Received delete_note request!');
        // If payload given, attempt to delete note
        if (msg && msg.user_id && msg.note_id && msg.name && msg.data) {
            // Get connection
            await pool.connect(async (err, client, done) => {
                // Remove note from DB
                const { user_id, note_id, name, data } = msg;
                const u_id = await getUID_client(user_id, client);
                await saveNote_client(u_id, note_id, name, data, client);

                // Close connection
                done();

                // Return a response message to refresh user profile with new profile
                console.log('Acking successful note save!');
                ack();
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