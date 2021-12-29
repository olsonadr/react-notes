// Function to check for new users, sign them up as needed, and return their info
exports.checkNewUser = async (email, name, picture, user_id, pool, getUID, getProfile) => {
    // Check if user is new to the server
    let res = await getUID(user_id, pool);
    
    // Get id if found
    let u_id = undefined;
    if (res) u_id = res;
    
    // If res.rowCount is 0 (id not found), this is new user, add to table
    if (res && res.rowCount === 0 && !u_id) {
        // Establish psql connection
        const client = await pool.connect();
        
        // Execute query to add user
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
            
            // Close client connection
            client.end();
        }
        
        // Query for all profile information given id
        let data = await getProfile(u_id, pool);

        // Return result (object filled with user info)
        return data;
    };