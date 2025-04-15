const router = require("express").Router();

const verifyLogIn = require("../middlewares/auth/verifyLogIn");
const campaignController = require("../controllers/campaignController");
const { uploadCampaign } = require("../middlewares/storeImgCloud");

// get categories campaigns /api/campaigns/categories [GET]
router.get("/categories", campaignController.getCategories);

// creata a new campaign /api/campaigns/create [POST]
router.post(
    "/create",
    verifyLogIn,
    uploadCampaign.single("campaign_image"),
    campaignController.createCampaign
);

module.exports = router;
