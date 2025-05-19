const pool = require("../configDB");

const insertTransaction = async (data) => {
    try {
        console.log(data);
        
        const query = `
        INSERT INTO user_transactions
        (user_id, transaction_type, method, provider_name, amount, currency, status)
        VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `;

        const values = [
            data.user_id,
            data.transaction_type,
            data.method,
            data.provider_name,
            data.amount,
            data.currency,
            data.status
        ];

        const res = await pool.query(query, values);

        return res.rows[0];
    } catch (error) {
        console.error("Error inserting transaction:", error);
        throw new Error("Database error");
    }
};

module.exports = {
    insertTransaction
};
