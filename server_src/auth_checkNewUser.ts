// Function to check for new users, sign them up as needed, and return their info
exports.checkNewUser = async (email, name, picture, user_id, pool) => {
// const checkNewUser = async (email:string, name:string, picture:string, pool:any) => {
    // Check if user is new to the server
    const client = await pool.connect();
    let res;
    try {
        const selquery = `SELECT id FROM users WHERE user_id = '${user_id}';`;
        res = await client.query(selquery);
        // } catch (err:any) {
    } catch (err) {
        console.error(err.stack);
        client.end();
        return; // redirect to error page
    }

    // Get id if found
    let id = undefined;
    if (res && res.rowCount > 0) id = res.rows[0].id;

    // If res.rowCount is 0 (id not found), this is new user, add to table
    if (res && res.rowCount === 0) {
        res = undefined;
        try {
            const insquery = `INSERT INTO users(email, name, picture, user_id) VALUES('${email}', '${name}', '${picture}', '${user_id}') RETURNING id;`;
            res = await client.query(insquery);
            // } catch (err:any) {
        } catch (err) {
            console.error(err.stack);
            client.end();
            return; // redirect to error page
        }

        // Use id
        if (res && res.rowCount > 0) id = res.rows[0].id;
    }

    // // Query for all profile information given id
    let data = undefined;
    try {
        const sel2query = `SELECT * FROM users WHERE id=${id};`;
        res = await client.query(sel2query);
        if (res && res.rowCount > 0) data = res.rows[0];
    // } catch (err:any) {
    } catch (err) {
        console.error(err.stack);
        client.end();
        return; // redirect to error page
    }

    // Close client connection
    client.end();

    // Return result (object filled with user info)
    return data;
};