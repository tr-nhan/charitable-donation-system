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

// get updated info of a campaign /api/campaign/updates [POST]
router.post("/updates", verifyLogIn, campaignController.getUpdatedInfoCampaign);

// add campaign update /api/campaign/updates/insert/info [POST]
router.post("/updates/insert/info", verifyLogIn, campaignController.insertCampaignUpdate);

// add campaign update images /api/campaign/updates/insert/images [POST]
router.post(
    "/updates/insert/images",
    verifyLogIn,
    uploadCampaign.array("updateImages"),
    campaignController.insertCampaignUpdateImages
);

// filter campaign with pagination
router.get("/filter", campaignController.filterCampaignsWithPaginationController);

// get campaign balance
router.post("/balance", campaignController.getCampaignBalance);

// insert campaign report /api/campaign/report/insert [POST]
router.post(
    "/report/insert",
    verifyLogIn,
    uploadCampaign.array("reportImages"),
    campaignController.insertReport
);

// get campaign info following report /api/campaign/info/report [GET]
router.get("/info/report", campaignController.getCampaignInfoFollowReport);

// update campaign suspend /api/campaign/update/suspend [POST]
router.post("/update/suspend", verifyLogIn, campaignController.updateCampaignSuspendStatus);

// update campaign metamask add /api/campaign/update/metamask_add [POST]
router.post("/update/metamask_add", verifyLogIn, campaignController.updateMetamaskAdd);

module.exports = router;
