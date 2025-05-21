const { getCategoriesCampaigns } = require("../models/query/campaignsQuery");

const {
    insertCampaign,
    getCampaignsFilter,
    getCampaignImgs,
    getCampaignReactions
} = require("../models/query/campaignsQuery");

const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesCampaigns();
        if (categories.length === 0) {
            return res.status(404).json({ error: 1, message: "No categories found" });
        }
        res.status(200).json({ error: 0, results: categories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const createCampaign = async (req, res) => {
    try {
        const campaignData = {
            creator_id: req.user.user_id,
            title: req.body.title,
            description: req.body.description,
            goal_amount: req.body.goal_amount,
            start_date: req.body.start_date || null,
            end_date: req.body.end_date || null,
            campaign_image: req.file?.path,
            category: req.body.category
        };

        const newCampaign = await insertCampaign(campaignData);

        if (!newCampaign) return res.status(500).json({ error: 1, message: "Server is broken" });

        return res.json({ error: 0, message: "Create successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const getInfoCampaignsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 2, message: "User ID is required" });
        }
        const filter = { creator_id: userId };
        const campaignsInfo = await getCampaignsFilter(filter);

        return res.status(200).json({ error: 0, results: campaignsInfo });
    } catch (error) {
        console.error("Error filtering user info:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const getFullInfoCampaign = async (req, res) => {
    const { campaignId } = req.body;
    if (!campaignId) {
        return res.status(400).json({ error: 1, message: "Missing some required fields" });
    }
    try {
        var results = new Object();
        var campaignInfo = await getCampaignsFilter({ campaign_id: campaignId });
        var campaignImgs = await getCampaignImgs(campaignId);
        var campaignReactions = await getCampaignReactions({ campaign_id: campaignId });

        if (campaignInfo.length === 1) {
            results.campaignInfo = campaignInfo;
        } else return res.json({ error: 1, message: "Something when wrong" });

        if (campaignImgs.length !== 0) {
            var imgs = campaignImgs.image_url;
            imgs = imgs.trim().split(",");
            results.campaignImages = imgs;
        } else results.campaignImages = [];

        if (campaignReactions.length !== 0) {
            
        }
        return res.json({ error: 0, results });
    } catch (error) {
        console.error("Error filtering user info:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    getCategories,
    createCampaign,
    getInfoCampaignsByUser,
    getFullInfoCampaign
};
