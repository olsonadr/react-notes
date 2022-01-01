// Function to add a new note to the db with given u_id, name, and data,
//  returning the note_id of the created note
exports.addNewNote = async (u_id, name, data, pool) => {
    // Get psql connection
    const client = await pool.connect();
    let res;
    try {
        const selquery = `SELECT add_note(${u_id}, '${name}', '${data}') AS note_id;`;
        res = await client.query(selquery);
    } catch (err) {
        console.error(err.stack);
        client.end();
        return;
    }

    // Close client connection
    client.end();

    // Return result if found, or undefined
    return res && res.rowCount && res.rowCount > 0 ? res.rows[0].note_id : null;
};

exports.addNewNote_client = async (u_id, name, data, client) => {
    // Get psql connection
    let res;
    try {
        const selquery = `SELECT add_note(${u_id}, '${name}', '${data}') AS note_id;`;
        res = await client.query(selquery);
    } catch (err) {
        console.error(err.stack);
        return;
    }

    // Return result if found, or undefined
    return res && res.rowCount && res.rowCount > 0 ? res.rows[0].note_id : null;
};