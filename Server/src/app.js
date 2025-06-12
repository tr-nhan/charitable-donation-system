const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const ejs = require("ejs");
require("dotenv").config();

const { setupSocket } = require("./config/socket");
const app = express();
const server = http.createServer(app);

setupSocket(server);

// Ejs config
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

// Auth Router
const authRouter = require("./routes/auth.route");
app.use("/api/auth", authRouter);

// User Router
const userRouter = require("./routes/user.route");
app.use("/api/user", userRouter);

// Campaign Router
const campaignRouter = require("./routes/campaign.route");
app.use("/api/campaign", campaignRouter);

// Services Router
const servicesRouter = require("./routes/services.route");
app.use("/api/services", servicesRouter);

// Transaction Router
const transactionRouter = require("./routes/transaction.route");
app.use("/api/transaction", transactionRouter);

// User balance Router
const userBalanceRouter = require("./routes/userBalance.route");
app.use("/api/balance", userBalanceRouter);

// Donations Router
const donationRouter = require("./routes/donation.route");
app.use("/api/donation", donationRouter);

// Withdraw Router
const withdrawRouter = require("./routes/withdraw.route");
app.use("/api/withdraw", withdrawRouter);

//SendTips Router
const tipsRoute = require("./routes/tips.route");
app.use("/api", tipsRoute);

server.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT ${process.env.PORT}`);
});
