const { insertDonationQuery } = require("../models/query/donationQuey");

const insertDonation = async (req, res) => {
    try {
        const {
            campaignId,
            donorId,
            donorName,
            donorEmail,
            message,
            isAnonymous,
            fiatAmount,
            cryptoAmount
        } = req.body;

        if (!campaignId || !donorId || !donorName || !donorEmail || !message) {
            return res.status(400).json({ error: 1, message: "Missing some required fields" });
        }

        const response = await insertDonationQuery({
            campaignId,
            donorId,
            donorName,
            donorEmail,
            message,
            isAnonymous,
            fiatAmount,
            cryptoAmount
        });

        if (response.error === 0) {
            res.json({ error: 0, message: "Success" });
        } else res.json({ error: 1, message: "Server is broken" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    insertDonation
};
