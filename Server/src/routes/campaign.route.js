const router = require("express").Router();

const verifyLogIn = require("../middlewares/auth/verifyLogIn");
const campaignController = require("../controllers/campaignController");
const { uploadCampaign } = require("../middlewares/storeImgCloud");

// get categories campaigns /api/campaign/categories [GET]
router.get("/categories", campaignController.getCategories);

// creata a new campaign /api/campaign/create [POST]
router.post(
    "/create",
    verifyLogIn,
    uploadCampaign.single("campaign_image"),
    campaignController.createCampaign
);

// get campaigns by user /api/campaign/user/:userId [GET]
router.get("/user/:userId", verifyLogIn, campaignController.getInfoCampaignsByUser);

// get full info of a campaign /api/campaign/full_info [POST]
router.post("/full_info", campaignController.getFullInfoCampaign);

// insert campaign reaction /api/campaign/reaction/insert [POST]
router.post("/reaction/insert", verifyLogIn, campaignController.insertCampaignReaction);

// update campaign reaction /api/campaign/reaction/update [POST]
router.post("/reaction/update", verifyLogIn, campaignController.updateCampaignReaction);

// delete campaign reaction /api/campaign/reaction/delete [POST]
router.post("/reaction/delete", verifyLogIn, campaignController.deleteCampaignReaction);

module.exports = router;
