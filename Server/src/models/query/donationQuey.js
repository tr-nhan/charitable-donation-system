const pool = require("../configDB");

const insertDonationQuery = async (d) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // insert into donations table
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

        // update user balance
        var queryB = "";
        var balance = [];
        if (d.fiatAmount !== null) {
            queryB = `
            UPDATE user_balances
            SET fiat_balance = fiat_balance - $1
            WHERE user_id = $2`;
            balance.push(d.fiatAmount);
            balance.push(d.donorId);
        } else {
            queryB = `
            UPDATE user_balances
            SET crypto_balance = crypto_balance - $1
            WHERE user_id = $2`;
            balance.push(d.cryptoAmount);
            balance.push(d.donorId);
        }
        await client.query(queryB, balance);

        // update campaign raised
        var queryC = "";
        var campaign = [];
        if (d.fiatAmount !== null) {
            queryC = `
            UPDATE campaigns
            SET current_fiat = current_fiat + $1
            WHERE campaign_id = $2`;
            campaign.push(d.fiatAmount);
            campaign.push(d.campaignId);
        } else {
            queryC = `
            UPDATE campaigns
            SET current_crypto = current_crypto + $1
            WHERE user_id = $2`;
            campaign.push(d.cryptoAmount);
            campaign.push(d.campaignId);
        }
        await client.query(queryC, campaign);

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

module.exports = {
    insertDonationQuery
};
