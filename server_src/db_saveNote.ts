// Function to save the given note to the db with given u_id, note_id, name, and data
exports.saveNote = async (u_id, note_id, name, data, pool) => {
    // Get psql connection
    const client = await pool.connect();
    try {
        const updquery = `UPDATE notes SET data=${data} name=${name} WHERE u_id=${u_id} AND note_id=${note_id}`;
        await client.query(updquery);
    } catch (err) {
        console.error(err.stack);
        client.end();
        return;
    }

    // Close client connection
    client.end();

    // Return from function
    return;
};

exports.saveNote_client = async (u_id, note_id, name, data, client) => {
    // Get psql connection
    try {
        const updquery = `UPDATE notes SET data='${data}', name='${name}' WHERE u_id=${u_id} AND note_id=${note_id};`;
        await client.query(updquery);
    } catch (err) {
        console.error(err.stack);
        return;
    }

    // Return from function
    return;
};