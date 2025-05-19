const { getUserBalance } = require("../models/query/userBalanceQuery");

const getBalance = async (req, res) => {
    const { userId } = req.body;
    try {
        if (!userId) {
            res.status(400).json({ error: 1, message: "Missing some require fields" });
            return;
        }

        const response = await getUserBalance({ user_id: userId });        

        res.json({ error: 0, results: response });
    } catch (error) {
        console.log(error);
        resizeBy.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    getBalance
};
