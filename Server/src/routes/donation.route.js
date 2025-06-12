const router = require("express").Router();

const verifyLogIn = require("../middlewares/auth/verifyLogIn");
const donationController = require("../controllers/donationController");

// insert a donation /api/donation/insert [POST]
router.post("/insert", verifyLogIn, donationController.insertDonation);

module.exports = router;
