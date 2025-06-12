const express = require("express");
const router = express.Router();
const tipsController = require("../controllers/tipsController");

router.post("/send-tips", tipsController.sendTips);

module.exports = router;
