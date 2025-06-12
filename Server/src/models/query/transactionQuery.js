const pool = require("../configDB");

const insertTransaction = async (data) => {
    try {
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

const getTransactionHistoryQuery = async (userId) => {
    try {
        // deposit
        const queryD = `
        SELECT *
        FROM user_transactions
        WHERE user_id = $1 AND transaction_type = 'deposit'
        `;
        const historyDeposit = await pool.query(queryD, [userId]);

        // withdraw
        const queryW = `
        SELECT w.*
        FROM withdraw_request w
        INNER JOIN campaigns c ON c.campaign_id = w.campaign_id
        INNER JOIN users u ON u.user_id = c.creator_id
        WHERE u.user_id = $1
        `;
        const historyWithdraw = await pool.query(queryW, [userId]);

        // donations
        const queryDona = `
        SELECT d.*, c.title
        FROM donations d
        INNER JOIN campaigns c ON d.campaign_id = c.campaign_id
        WHERE d.donor_id = $1
        `;
        const historyDonation = await pool.query(queryDona, [userId]);

        return {
            historyDeposit: historyDeposit.rows,
            historyWithdraw: historyWithdraw.rows,
            historyDonation: historyDonation.rows
        };
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    insertTransaction,
    getTransactionHistoryQuery
};
