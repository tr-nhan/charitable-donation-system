const pool = require("../configDB");

const getWithdrawRequestByFilters = async (filters) => {
    try {
        let query = `
            SELECT 
                w.id,
                w.campaign_id,
                w.amount,
                w.method,
                w.method_info,
                w.status,
                w.created_at,
                c.title,
                c.goal_fiat,
                c.goal_crypto,
                c.current_fiat,
                c.current_crypto,
                u.user_id AS creator_id, 
                u.full_name AS creator_name, 
                cb.fiat_amount AS fiat_balance, 
                cb.crypto_amount AS crypto_balance
            FROM withdraw_request w
            INNER JOIN campaigns c ON w.campaign_id = c.campaign_id
            INNER JOIN users u ON c.creator_id = u.user_id
            INNER JOIN campaign_balances cb ON w.campaign_id = cb.campaign_id
        `;

        const conditions = [];
        const values = [];

        var i = 1;
        for (const [key, value] of Object.entries(filters)) {
            conditions.push(`w.${key} = $${i}`);
            values.push(value);
            ++i;
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const insertWithdrawRequest = async (values) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // insert into withdraw request
        const queryW = `
        INSERT INTO withdraw_request
        (campaign_id, amount, method, method_info)
        VALUES ($1, $2, $3, $4)
        `;

        await client.query(queryW, [
            values.campaignId,
            values.amount,
            values.method,
            values.methodInfo
        ]);

        // update campaign balance
        const queryB = `
        UPDATE campaign_balances
        SET fiat_amount = fiat_amount - $1
        WHERE campaign_id = $2
        `;
        await client.query(queryB, [values.amount, values.campaignId]);

        await client.query("COMMIT");

        return { error: 0 };
    } catch (error) {
        await client.query("ROLLBACK");
        console.log(error);
        return { error: 1, message: error };
    } finally {
        client.release();
    }
};

const updateStatusWithdrawRequestQuery = async (status, id) => {
    try {        
        const query = `
        UPDATE withdraw_request
        SET status = $1
        WHERE id = $2
        `;

        await pool.query(query, [status, id]);

        return { error: 0 };
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getWithdrawRequestByFilters,
    insertWithdrawRequest,
    updateStatusWithdrawRequestQuery
};
