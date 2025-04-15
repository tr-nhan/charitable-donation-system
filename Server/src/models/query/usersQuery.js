const pool = require("../configDB");

const getInfoFilter = async (data) => {
    try {
        const pairs = data
            .reduce((acc, curr) => {
                const key = Object.keys(curr)[0];
                const value = curr[key];

                const formattedValue = typeof value === "string" ? `'${value}'` : value;

                return acc + `${key}=${formattedValue} AND `;
            }, "")
            .slice(0, -5);

        const userInfo = await pool.query(`SELECT * FROM users WHERE ${pairs}`);

        return userInfo.rows;
    } catch (error) {
        console.log(error);
    }
};

const insertUser = async (data) => {
    try {
        const fields = data.map((obj) => Object.keys(obj)[0]);

        const values = data.map((obj) => Object.values(obj)[0]);

        const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

        const query = `INSERT INTO users (${fields.join(", ")}) VALUES (${placeholders}) RETURNING *`;

        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.log(error);
    }
};

const updateUserAvatarInDatabase = async (userId, newAvatar) => {
    try {
        const query = `UPDATE users SET profile_image = $1 WHERE user_id = $2 RETURNING *`;
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

        const query = `UPDATE users SET ${fields.join(", ")} WHERE user_id = $${values.length + 1} RETURNING *`;
        values.push(user_id);

        const result = await pool.query(query, values);
        
        return result.rows[0];
    } catch (error) {
        console.error("Error updating user info:", error);
        throw error;
    }
}

module.exports = {
    getInfoFilter,
    insertUser,
    updateUserAvatarInDatabase,
    updateUserInfo,
};
