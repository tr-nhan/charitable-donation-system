const jwt = require("jsonwebtoken");
const passport = require("../config/passportConfig");
require("dotenv").config();

const { getInfoFilter, insertUser } = require("../models/query/usersQuery");
const hashPassword = require("../utils/hashPassword");
const verifySignUpMail = require("../utils/sendMail/verifySignUpMail");
const { getIo } = require("../config/socket");
const { notifyVerificationStatus } = require("../utils/sockets/verifySignUp");

// Login with local
const loginWithLocal = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: "1", message: "Server is broken", details: err });
        }

        if (!user) return res.json({ error: 2, message: "Email or Password is incorrect" });

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            error: 0,
            message: "Login successful",
            results: {
                user_id: user.user_id,
                email: user.email,
                role: user.email === "admin@gmail.com" ? "admin" : "user"
            }
        });
    })(req, res, next);
};

// Login with Google
const loginWithGoogle = (req, res) => {
    const user = req.user;
    if (!user) return res.status(500).json({ error: 1, message: "Server is broken" });

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.SECRET_KEY, {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.redirect(`${process.env.CLIENT_URL}/login-success`);
};

// Logout
const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        expires: new Date(0)
    });

    return res.json({ error: 0, message: "Logged out successfully" });
};

const checkLogin = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.json({ error: 1, message: "Token is missing" });

        const { user_id, email } = await jwt.verify(token, process.env.SECRET_KEY);

        if (!user_id || !email) return res.json({ error: 2, message: "Token is incorrect" });

        let user = await getInfoFilter({ user_id, email });

        if (user.length === 0) return res.json({ error: 3, message: "User not found" });

        return res.json({
            error: 0,
            results: { user_id, email, role: email === "admin@gmail.com" ? "admin" : "user" }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

// Verify Sign Up
const verifySignUp = async (req, res) => {
    const email = req.body.email;
    try {
        if (!email)
            return res.status(400).json({ error: 2, message: "Missing some requied fields" });

        const isExisted = await getInfoFilter({ email, provider: "local" });

        if (isExisted.length > 0)
            return res.json({ error: 3, message: "This email has been existed" });

        const token = await jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "10m" });

        const url = `${process.env.CLIENT_URL}/verify/sign-up?token=${token}`;

        await verifySignUpMail(url, email, "CHARITY DONATION UIT: Verify Account");

        res.json({ error: 0 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const handleVerifyAccount = async (req, res) => {
    const token = req.body.token;
    try {
        let email = jwt.verify(token, process.env.SECRET_KEY);
        email = email.email;

        if (!email) return res.json({ error: 2 });

        const isExisted = await getInfoFilter({ email, provider: "local" });

        if (isExisted.length > 0)
            return res.json({ error: 3, message: "This email has already been verified" });

        const io = getIo();

        if (!io) {
            console.log("Socket.io chưa được khởi tạo");
            return res.json({ error: 1, message: "Server error" });
        }

        notifyVerificationStatus(io, email, true);

        res.json({ error: 0 });
    } catch (error) {
        console.log(error);
        return res.json({ error: 1, message: "Expired or Invalid token" });
    }
};

const signUpAccount = async (req, res) => {
    const { email, password, full_name } = req.body;

    try {
        if (!email || !password || !full_name)
            return res.status(400).json({ error: 2, message: "Missing some required fields" });

        const isExisted = await getInfoFilter({ email, provider: "local" });

        if (isExisted.length > 0)
            return res.json({ error: 3, message: "This email has been existed" });

        const hashedPassword = await hashPassword(password);

        const result = await insertUser([
            { email },
            { password_hash: hashedPassword },
            { full_name },
            { provider: "local" },
            { is_verified: true }
        ]);

        return res.json({ error: 0, message: "Successfully", results: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, message: "Server is broken!" });
    }
};

module.exports = {
    loginWithLocal,
    loginWithGoogle,
    signUpAccount,
    checkLogin,
    logout,
    verifySignUp,
    handleVerifyAccount
};
