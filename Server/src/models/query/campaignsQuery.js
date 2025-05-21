const pool = require("../configDB");

const getCategoriesCampaigns = async () => {
    try {
        const categories = await pool.query(`SELECT * FROM campaign_categories`);

        return categories.rows;
    } catch (error) {
        console.log(error);
    }
};

const getCampaignsFilter = async (filter) => {
    try {
        const keys = Object.keys(filter);
        const values = Object.values(filter);

        if (keys.length === 0) {
            throw new Error("No filters provided");
        }

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`);
        const query = `SELECT * 
        FROM campaigns cp
        INNER JOIN campaign_categories ctg
        ON cp.category_id = ctg.category_id
        WHERE ${conditions.join(" AND ")}`;

        const campaignsInfo = await pool.query(query, values);

        return campaignsInfo.rows;
    } catch (error) {
        console.error("Error filtering campaign info:", error);
        throw error;
    }
};

const getCampaignImgs = async (campaignId) => {
    try {
        const query = `
        SELECT * 
        FROM campaign_images
        WHERE campaign_id = $1`;
        const condition = [campaignId];

        const campaignImgs = await pool.query(query, condition);

        return campaignImgs.rows;
    } catch (error) {
        console.error("Error filtering campaign images:", error);
        throw error;
    }
};

const getCampaignReactions = async (filter) => {
    try {
        const keys = Object.keys(filter);
        const values = Object.values(filter);

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`);
        const query = `
        SELECT u.user_id, u.full_name, cpr.reaction_type, cpr.created_at
        FROM campaign_reactions cpr
        INNER JOIN users u
        ON cpr.user_id = u.user_id
        WHERE ${conditions.join(" AND ")}
        `;

        const campaignReactions = await pool.query(query, values);

        return campaignReactions.rows;
    } catch (error) {
        console.error("Error filtering campaign reactions:", error);
        throw error;
    }
};

const insertCampaign = async (campaignData) => {
    try {
        const query = `
            INSERT INTO campaigns 
            (creator_id, title, description, goal_amount, start_date, end_date, campaign_image, category_id) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            campaignData.creator_id,
            campaignData.title,
            campaignData.description,
            campaignData.goal_amount,
            campaignData.start_date,
            campaignData.end_date || null,
            campaignData.campaign_image || null,
            campaignData.category || null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting campaign:", error);
        throw new Error("Database error");
    }
};

module.exports = {
    getCategoriesCampaigns,
    insertCampaign,
    getCampaignsFilter,
    getCampaignImgs,
    getCampaignReactions
};
