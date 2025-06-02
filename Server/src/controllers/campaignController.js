const { getCategoriesCampaigns } = require("../models/query/campaignsQuery");

const {
    insertCampaign,
    getCampaignsFilter,
    getCampaignImgs,
    getCampaignReactions,
    getDonations,
    insertReaction,
    updateReaction,
    deleteReaction,
    getUpdatedInfo,
    insertUpdateInfo,
    updateCampaignImages,
    filterCampaignsWithPagination,
    getCampaignBalanceQuery,
    getReportByCampaignId,
    insertReportCampaignQuery,
    getCampaignInfoFollowReportQuery,
    updateCampaignSuspendStatusQuery,
    updateMetamaskAddQuery
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
            goal_fiat: req.body.goal_fiat,
            goal_crypto: req.body.goal_crypto || 0,
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
        var campaignDonations = await getDonations({ campaign_id: campaignId });
        var campaignReports = await getReportByCampaignId(campaignId);

        if (campaignInfo.length === 1) {
            const campaign = campaignInfo[0];

            // if (campaign.update_time !== null) {
            //     campaign.title = campaign.latest_title;
            //     campaign.content = campaign.latest_content;
            //     campaign.update_image = campaign.latest_image;
            // } else campaign.update_time = 0;

            // delete campaign.latest_title;
            // delete campaign.latest_content;
            // delete campaign.latest_image;

            if (campaign.update_time === null) campaign.update_time = 0;

            results.campaignInfo = campaign;
        } else {
            return res.json({ error: 1, message: "Something went wrong" });
        }

        if (campaignImgs.length !== 0) {
            var imgs = campaignImgs[0].image_url;
            imgs = imgs.split(",");
            results.campaignImages = imgs;
        } else results.campaignImages = [];

        if (campaignReactions.length !== 0) {
            const reactionStats = {
                number_of_heart: 0,
                number_of_thumb_up: 0,
                number_of_thumb_down: 0,
                number_of_smile: 0,
                total_reaction: 0
            };

            for (const reaction of campaignReactions) {
                switch (reaction.reaction_type) {
                    case "heart":
                        reactionStats.number_of_heart++;
                        break;
                    case "thumb_up":
                        reactionStats.number_of_thumb_up++;
                        break;
                    case "thumb_down":
                        reactionStats.number_of_thumb_down++;
                        break;
                    case "smile":
                        reactionStats.number_of_smile++;
                        break;
                }

                reactionStats.total_reaction++;
            }

            results.campaignReactions = {
                data: campaignReactions,
                stats: reactionStats
            };
        } else {
            results.campaignReactions = {
                data: [],
                stats: {
                    number_of_heart: 0,
                    number_of_thumb_up: 0,
                    number_of_thumb_down: 0,
                    number_of_smile: 0,
                    total_reaction: 0
                }
            };
        }

        if (campaignDonations.donations.length !== 0) {
            results.campaignDonations = {
                stats: campaignDonations.summary,
                data: campaignDonations.donations
            };
        } else {
            results.campaignDonations = {
                stats: campaignDonations.summary,
                data: campaignDonations.donations
            };
        }

        results.campaignReports = {
            count: campaignReports.length,
            data: campaignReports
        };

        return res.json({ error: 0, results });
    } catch (error) {
        console.error("Error filtering user info:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const insertCampaignReaction = async (req, res) => {
    try {
        const { campaignId, reactionType } = req.body;
        const userId = req.user.user_id;

        if (!campaignId || !reactionType) {
            return res.status(400).json({ error: 1, message: "Missing some required fields" });
        }

        // Insert the reaction into the database
        const result = await insertReaction({ userId, campaignId, reactionType });

        if (result) {
            return res.status(200).json({ error: 0, message: "Reaction added successfully" });
        } else {
            return res.status(500).json({ error: 1, message: "Failed to add reaction" });
        }
    } catch (error) {
        console.error("Error inserting campaign reaction:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const updateCampaignReaction = async (req, res) => {
    try {
        const { campaignId, reactionType } = req.body;
        const userId = req.user.user_id;

        if (!campaignId || !reactionType) {
            return res.status(400).json({ error: 1, message: "Missing some required fields" });
        }

        // Update the reaction in the database
        const result = await updateReaction({ userId, campaignId, reactionType });

        if (result) {
            return res.status(200).json({ error: 0, message: "Reaction updated successfully" });
        } else {
            return res.status(500).json({ error: 1, message: "Failed to update reaction" });
        }
    } catch (error) {
        console.error("Error updating campaign reaction:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const deleteCampaignReaction = async (req, res) => {
    try {
        const { campaignId } = req.body;
        const userId = req.user.user_id;

        if (!campaignId) {
            return res.status(400).json({ error: 1, message: "Missing some required fields" });
        }

        // Delete the reaction from the database
        const result = await deleteReaction({ userId, campaignId });

        if (result) {
            return res.status(200).json({ error: 0, message: "Reaction deleted successfully" });
        } else {
            return res.status(500).json({ error: 1, message: "Failed to delete reaction" });
        }
    } catch (error) {
        console.error("Error deleting campaign reaction:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const getUpdatedInfoCampaign = async (req, res) => {
    try {
        const { campaignId } = req.body;

        if (!campaignId) {
            return res.status(400).json({ error: 1, message: "Missing campaign ID" });
        }
        const updates = await getUpdatedInfo(campaignId);

        res.status(200).json({ error: 0, results: updates });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const insertCampaignUpdate = async (req, res) => {
    try {
        const { campaignId, title, content } = req.body;
        const userId = req.user.user_id;

        if (!campaignId || !title || !content) {
            return res.status(400).json({ error: 1, message: "Missing some required fields" });
        }

        const updateData = {
            campaignId,
            authorId: userId,
            title,
            content
        };

        const newUpdate = await insertUpdateInfo(updateData);

        if (newUpdate) {
            return res.status(200).json({ error: 0, message: "Update added successfully" });
        } else {
            return res.status(500).json({ error: 1, message: "Failed to add update" });
        }
    } catch (error) {
        console.error("Error inserting campaign update:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const insertCampaignUpdateImages = async (req, res) => {
    try {
        const { campaignId } = req.body;
        if (!campaignId) {
            return res.status(400).json({ error: 1, message: "Missing campaign ID" });
        }
        const uploadedImages = req.files;

        const image_urls = uploadedImages.map((file) => file.path).join(",");
        const updatedCampaign = await updateCampaignImages(campaignId, image_urls);
        if (updatedCampaign) {
            return res.status(200).json({ error: 0, message: "Images added successfully" });
        } else {
            return res.status(500).json({ error: 1, message: "Failed to add images" });
        }
    } catch (error) {
        console.error("Error inserting campaign update images:", error);
        return res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const filterCampaignsWithPaginationController = async (req, res) => {
    try {
        const {
            q = "",
            fromGoal = 0,
            toGoal = Number.MAX_SAFE_INTEGER,
            categoryId = null,
            page = 0
        } = req.query;        

        const result = await filterCampaignsWithPagination(
            q,
            parseInt(fromGoal),
            parseInt(toGoal),
            categoryId ? parseInt(categoryId) : null,
            parseInt(page)
        );

        res.status(200).json({
            error: 0,
            message: "Filter campaigns successfully",
            results: result
        });
    } catch (error) {
        console.error("Error in filterCampaignsWithPaginationController:", error);
        res.status(500).json({
            success: false,
            message: "Server error while filtering campaigns"
        });
    }
};

const getCampaignBalance = async (req, res) => {
    try {
        const { campaignId } = req.body;

        if (!campaignId)
            return res.status(400).json({ error: 1, message: "Missing some required fields" });

        const results = await getCampaignBalanceQuery(campaignId);

        return res.json({ error: 0, results: results.rows[0] || [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

const insertReport = async (req, res) => {
    try {
        const { campaignId, reportText, reporterId } = req.body;

        const uploadedImages = req.files;
        const reportImages = uploadedImages.map((file) => file.path).join(",");

        if (!campaignId || !reportText || !reportImages || !reporterId)
            return res.json({ error: 1, message: "Missing some required fields" });

        await insertReportCampaignQuery({ campaignId, reportText, reportImages, reporterId });

        res.json({ error: 0, message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 0, message: "Server is broken" });
    }
};

const getCampaignInfoFollowReport = async (req, res) => {
    try {
        const results = await getCampaignInfoFollowReportQuery();

        res.json({ error: 0, results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 0, message: "Server is broken" });
    }
};

const updateCampaignSuspendStatus = async (req, res) => {
    try {
        const { status, campaignId } = req.body;

        await updateCampaignSuspendStatusQuery(status, campaignId);

        res.json({ error: 0, message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 0, message: "Server is broken" });
    }
};

const updateMetamaskAdd = async (req, res) => {
    try {
        const { add, campaignId } = req.body;

        await updateMetamaskAddQuery(add, campaignId);

        res.json({ error: 0, message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server is broken" });
    }
};

module.exports = {
    getCategories,
    createCampaign,
    getInfoCampaignsByUser,
    getFullInfoCampaign,
    insertCampaignReaction,
    updateCampaignReaction,
    deleteCampaignReaction,
    getUpdatedInfoCampaign,
    insertCampaignUpdate,
    insertCampaignUpdateImages,
    filterCampaignsWithPaginationController,
    getCampaignBalance,
    insertReport,
    getCampaignInfoFollowReport,
    updateCampaignSuspendStatus,
    updateMetamaskAdd
};
