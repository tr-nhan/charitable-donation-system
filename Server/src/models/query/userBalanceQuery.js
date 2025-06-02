const pool = require("../configDB");

const increaseUserBalance = async (userId, amount = { fiat_balance: 0, crypto_balance: 0 }) => {
    try {
        const query = `
            INSERT INTO user_balances (user_id, fiat_balance, crypto_balance)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id)
            DO UPDATE
            SET fiat_balance   = user_balances.fiat_balance   + EXCLUDED.fiat_balance,
                crypto_balance = user_balances.crypto_balance + EXCLUDED.crypto_balance
            RETURNING *;
        `;

        const values = [userId, amount.fiat_balance, amount.crypto_balance];

        const res = await pool.query(query, values);

        return res.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const decreaseUserBalance = async (userId, amount = { fiat_balance: 0, crypto_balance: 0 }) => {
    try {
        const query = `
            INSERT INTO user_balances (user_id, fiat_balance, crypto_balance)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id)
            DO UPDATE
            SET fiat_balance   = user_balances.fiat_balance   - EXCLUDED.fiat_balance,
                crypto_balance = user_balances.crypto_balance - EXCLUDED.crypto_balance
            RETURNING *;
        `;

        const values = [userId, amount.fiat_balance, amount.crypto_balance];

        const res = await pool.query(query, values);

        return res.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getUserBalance = async (conditions) => {
    try {
        const keys = Object.keys(conditions);

        const whereFragments = keys.map((k, i) => `${k} = $${i + 1}`);
        const whereClause = whereFragments.join(" AND ");

        const values = keys.map((k) => conditions[k]);

        const query = `SELECT * FROM user_balances WHERE ${whereClause}`;

        const res = await pool.query(query, values);
        
        return res.rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    increaseUserBalance,
    decreaseUserBalance,
    getUserBalance
};
