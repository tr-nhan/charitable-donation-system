const { getUserBalance } = require("../models/query/userBalanceQuery");

const getBalance = async (req, res) => {
    const { userId } = req.body;
    
    try {
        if (!userId) {
            res.status(400).json({ error: 1, message: "Missing some require fields" });
            return;
        }

        const response = await getUserBalance({ user_id: userId }) || [];        
        
        const balance = response.length === 0 ? { fiat_balance: 0, crypto_balance: 0 } : response;
        
        res.json({ error: 0, results: balance });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    getBalance
};
