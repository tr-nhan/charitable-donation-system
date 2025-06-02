const pool = require("../configDB");

const getInfoFilter = async (data) => {
    try {
        const keys = Object.keys(data);
        const values = Object.values(data);

        if (keys.length === 0) {
            throw new Error("No filters provided");
        }

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`);
        const query = `SELECT email, full_name, provider, profile_image, bio, is_verified, private, user_id FROM users WHERE ${conditions.join(" AND ")}`;
        
        const userInfo = await pool.query(query, values);

        return userInfo.rows;
    } catch (error) {
        console.error("Error filtering user info:", error);
        throw error;
    }
};

const getPassword = async (user_id) => {
        try {            
            const userInfo = await pool.query('SELECT password_hash FROM users WHERE user_id = $1', [user_id]);
            
            return userInfo.rows[0];
        } catch (error) {
            console.error("Error hashing password:", error);
            throw error;
        }
}

const insertUser = async (data) => {
    try {
        const fields = data.map((obj) => Object.keys(obj)[0]);

        const values = data.map((obj) => Object.values(obj)[0]);

        const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

        const query = `INSERT INTO users (${fields.join(", ")}) VALUES (${placeholders}) RETURNING email, full_name, provider, profile_image, bio, is_verified, private, user_id`;

        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

const updateUserAvatarInDatabase = async (userId, newAvatar) => {
    try {
        const query = `UPDATE users SET profile_image = $1 WHERE user_id = $2 RETURNING email, full_name, provider, profile_image, bio, phone, is_verified, private, user_id`;
        const values = [newAvatar, userId];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating avatar in database:", error);
        throw error;
    }
};

const updateUserInfo = async (dataChange, user_id) => {
    try {
        const fields = Object.keys(dataChange).map((key, index) => `${key} = $${index + 1}`);
        const values = Object.values(dataChange);

        const query = `UPDATE users SET ${fields.join(", ")} WHERE user_id = $${values.length + 1} RETURNING email, full_name, provider, profile_image, bio, phone, is_verified, private, user_id`;
        values.push(user_id);

        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.error("Error updating user info:", error);
        throw error;
    }
};

const checkAdmin = async (userId) => {
    
}

module.exports = {
    getInfoFilter,
    insertUser,
    updateUserAvatarInDatabase,
    updateUserInfo,
    getPassword,
};
