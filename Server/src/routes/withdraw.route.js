const router = require("express").Router();
const withdrawController = require("../controllers/withdrawController");

router.post("/filter", withdrawController.getWithdrawRequest);

module.exports = router;
