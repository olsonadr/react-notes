// Function to check for new users, sign them up as needed, and return their info
exports.checkNewUser = async (email, name, picture, user_id, pool) => {
// const checkNewUser = async (email:string, name:string, picture:string, pool:any) => {
    // Check if user is new to the server
    const client = await pool.connect();
    let res;
    try {
        const selquery = `SELECT u_id FROM users WHERE user_id = '${user_id}';`;
        res = await client.query(selquery);
        // } catch (err:any) {
    } catch (err) {
        console.error(err.stack);
        client.end();
        return; // redirect to error page
    }

    // Get id if found
    let u_id = undefined;
    if (res && res.rowCount > 0) u_id = res.rows[0].u_id;

    // If res.rowCount is 0 (id not found), this is new user, add to table
    if (res && res.rowCount === 0 && !u_id) {
        res = undefined;
        try {
            const insquery = `INSERT INTO users(email, name, picture, user_id) VALUES('${email}', '${name}', '${picture}', '${user_id}') RETURNING u_id;`;
            res = await client.query(insquery);
            // } catch (err:any) {
        } catch (err) {
            console.error(err.stack);
            client.end();
            return; // redirect to error page
        }

        // Use id
        if (res && res.rowCount > 0) u_id = res.rows[0].u_id;
    }

    // // Query for all profile information given id
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