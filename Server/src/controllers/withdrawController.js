const { getWithdrawRequestByFilters } = require("../models/query/withdrawQuery");

const getWithdrawRequest = async (req, res) => {
    try {
        const { filters } = req.body;

        if (!filters) return res.json({ error: 1, message: "Missing some required fields" });

        const results = await getWithdrawRequestByFilters(filters);

        return res.json({ error: 0, results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    getWithdrawRequest
};
