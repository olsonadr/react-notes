// Function to delete a note from the db with given u_id and note_id,
exports.deleteNote = async (u_id, note_id, pool) => {
    // Get psql connection
    const client = await pool.connect();
    let res;
    try {
        const selquery = `SELECT delete_note(${u_id}, ${note_id}) AS note_id;`;
        res = await client.query(selquery);
    } catch (err) {
        console.error(err.stack);
        client.end();
        return;
    }

    // Close client connection
    client.end();
    return;
};

exports.deleteNote_client = async (u_id, note_id, client) => {
    // Get psql connection
    let res;
    try {
        const selquery = `SELECT delete_note(${u_id}, ${note_id}) AS note_id;`;
        res = await client.query(selquery);
    } catch (err) {
        console.error(err.stack);
        return;
    }

    return;
};