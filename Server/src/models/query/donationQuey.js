const pool = require("../configDB");

const insertDonationQuery = async (d) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Insert donation record
        const donation = [
            d.campaignId,
            d.donorId,
            d.donorName,
            d.donorEmail,
            d.message,
            d.isAnonymous,
            d.fiatAmount,
            d.cryptoAmount
        ];
        const queryD = `
        INSERT INTO donations 
        (campaign_id, donor_id, donor_name, donor_email, donation_message, is_anonymous, fiat_amount, crypto_amount) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)`;
        await client.query(queryD, donation);

        // 2. If fiat, update donor balance
        if (d.fiatAmount !== null) {
            const queryB = `
            UPDATE user_balances
            SET fiat_balance = fiat_balance - $1
            WHERE user_id = $2`;
            await client.query(queryB, [d.fiatAmount, d.donorId]);
        }

        // 3. Update campaign raised amount
        if (d.fiatAmount !== null) {
            const queryC = `
            UPDATE campaigns
            SET current_fiat = current_fiat + $1
            WHERE campaign_id = $2`;
            await client.query(queryC, [d.fiatAmount, d.campaignId]);
        } else if (d.cryptoAmount !== null) {
            const queryC = `
            UPDATE campaigns
            SET current_crypto = current_crypto + $1
            WHERE campaign_id = $2`;
            await client.query(queryC, [d.cryptoAmount, d.campaignId]);
        }

        // 4. Update campaign_balances only if fiat
        if (d.fiatAmount !== null) {
            const existCB = await client.query(
                "SELECT * FROM campaign_balances WHERE campaign_id = $1",
                [d.campaignId]
            );
            const fiatTmp = d.fiatAmount || 0;
            const cryptoTmp = d.cryptoAmount || 0;

            if (existCB.rows.length === 1) {
                const queryCB = `
                UPDATE campaign_balances
                SET
                    fiat_amount = fiat_amount + $1,
                    crypto_amount = crypto_amount + $2
                WHERE campaign_id = $3`;
                await client.query(queryCB, [fiatTmp, cryptoTmp, d.campaignId]);
            } else {
                const queryCB = `
                INSERT INTO campaign_balances
                (campaign_id, fiat_amount, crypto_amount)
                VALUES ($1, $2, $3)`;
                await client.query(queryCB, [d.campaignId, fiatTmp, cryptoTmp]);
            }
        }

        await client.query("COMMIT");
        return { error: 0 };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return { error: 1, message: error };
    } finally {
        client.release();
    }
};

module.exports = {
    insertDonationQuery
};
