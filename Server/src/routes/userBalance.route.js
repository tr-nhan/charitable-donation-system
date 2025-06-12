const router = require("express").Router();

const userBalanceController = require("../controllers/userBalanceController");
const verifyLogIn = require("../middlewares/auth/verifyLogIn");

// get user balance [POST] /api/balance
router.post("/", verifyLogIn, userBalanceController.getBalance);

module.exports = router;
