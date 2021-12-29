// Function to get the u_id of a user from their user_id
exports.getUID = async (user_id, pool) => {
    // Get psql connection
    const client = await pool.connect();
    let res;
    try {
        const selquery = `SELECT u_id FROM users WHERE user_id = '${user_id}';`;
        res = await client.query(selquery);
    } catch (err) {
        console.error(err.stack);
        client.end();
        return;
    }

    // Close client connection
    client.end();

    // Return result if found, or undefined
    return res && res.rowCount && res.rowCount > 0 ? res.rows[0].u_id : null;
};