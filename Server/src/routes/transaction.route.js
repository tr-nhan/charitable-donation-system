const router = require("express").Router();

const transactionController = require("../controllers/transactionController");
const verifyLogIn = require("../middlewares/auth/verifyLogIn");

// create a new order PAYPAL [POST] /api/transaction/deposit/paypal/create-order
router.post("/deposit/paypal/create-order", verifyLogIn, transactionController.newOrderPaypal);

// capture PAYPAL from client [POST] /api/transaction/deposit/paypal/capture
router.post("/deposit/paypal/capture", verifyLogIn, transactionController.captureOrderPaypal);

// get transaction history [POST] /api/transaction/history
router.post("/history", transactionController.getTransactionHistory);

module.exports = router;
