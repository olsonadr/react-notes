// Function to get all profile info of a user with given u_id
exports.getProfile = async (u_id, pool) => {
    // Get psql connection
    const client = await pool.connect();

    // Query for all profile information given id
    let res = undefined;
    let data = undefined;
    try {
        const sel2requested = `u_id, email, name, picture`;
        const sel2query = `SELECT ${sel2requested} from users WHERE users.u_id='${u_id}';`;
        res = await client.query(sel2query);
        if (res && res.rowCount > 0) data = res.rows[0];

        // If user found, get their notes and add as list in data output
        if (data) {
            const sel3requested = `note_id, name, data`;
            const sel3query = `SELECT ${sel3requested} from notes WHERE notes.u_id='${u_id}';`;
            res = await client.query(sel3query);
            if (res && res.rowCount > 0) {
                data.notes = res.rows;
            } else {
                data.notes = [];
            }
        }
    } catch (err) {
        console.error(err.stack);
        client.end();
        return;
    }

    // Close client connection
    client.end();

    // Add orig_data field to each note
    if (data && data.notes) {
        data.notes.forEach(note => {
            note.orig_data = note.data;
        });
    }

    // Return result (object filled with user info)
    return data;
};

exports.getProfile_client = async (u_id, client) => {
    // Query for all profile information given id
    let res = undefined;
    let data = undefined;
    try {
        const sel2requested = `u_id, email, name, picture`;
        const sel2query = `SELECT ${sel2requested} from users WHERE users.u_id='${u_id}';`;
        res = await client.query(sel2query);
        if (res && res.rowCount > 0) data = res.rows[0];

        // If user found, get their notes and add as list in data output
        if (data) {
            const sel3requested = `note_id, name, data`;
            const sel3query = `SELECT ${sel3requested} from notes WHERE notes.u_id='${u_id}';`;
            res = await client.query(sel3query);
            if (res && res.rowCount > 0) {
                data.notes = res.rows;
            } else {
                data.notes = [];
            }
        }
    } catch (err) {
        console.error(err.stack);
        return;
    }

    // Add orig_data field to each note
    if (data && data.notes) {
        data.notes.forEach(note => {
            note.orig_data = note.data;
        });
    }

    // Return result (object filled with user info)
    return data;
};