const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const { client } = require("../config/paypalConfig");
require("dotenv").config();

const {
    insertTransaction,
    getTransactionHistoryQuery
} = require("../models/query/transactionQuery");
const { increaseUserBalance } = require("../models/query/userBalanceQuery");

const newOrderPaypal = async (req, res) => {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ error: 1, message: "Missing some required fields" });

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: amount
                }
            }
        ],
        application_context: {
            return_url: `${process.env.CLIENT_URL}/deposit/paypal/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/deposit/paypal/payment-cancelled`
        }
    });

    try {
        const order = await client().execute(request);

        const approvalLink = order.result.links.find((link) => link.rel === "approve");

        res.json({ id: order.result.id, approvalUrl: approvalLink.href });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const captureOrderPaypal = async (req, res) => {
    const { orderId, fiatAmount } = req.body;
    const userId = req.user.user_id;
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
        const capture = await client().execute(request);
        const resultCapture = capture.result;

        await insertTransaction({
            user_id: userId,
            transaction_type: "deposit",
            method: "fiat",
            provider_name: "paypal_" + resultCapture.id,
            amount: fiatAmount,
            currency: "VND",
            status: "success"
        });

        await increaseUserBalance(userId, { fiat_balance: fiatAmount, crypto_balance: 0 });

        res.json({
            error: 0,
            results: capture.result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 1, messagse: "Server is broken" });
    }
};

const getTransactionHistory = async (req, res) => {
    try {                
        const { userId } = req.body;
        if (!userId)
            return res.status(400).json({ error: 1, message: "Missing some required fields" });

        const results = await getTransactionHistoryQuery(userId);

        results.historyDeposit = results.historyDeposit || [];
        results.historyWithdraw = results.historyWithdraw || [];
        results.historyDonation = results.historyDonation || [];

        return res.json({ error: 0, results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 0, message: "Server is broken" });
    }
};

module.exports = { newOrderPaypal, captureOrderPaypal, getTransactionHistory };
