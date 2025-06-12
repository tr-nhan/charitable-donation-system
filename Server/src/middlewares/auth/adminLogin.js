const jwt = require("jsonwebtoken");
require("dotenv").config();

const { getInfoFilter } = require("../../models/query/usersQuery");

const adminLogin = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token || token === "undefined")
        return res.status(401).json({ error: 1, message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const { user_id, email } = decoded;

        const isExist = await getInfoFilter({ user_id, email });

        if (isExist.length === 0)
            return res.status(401).json({ error: 1, message: "Unauthorized" });

        req.user = { user_id, email };

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = adminLogin;
