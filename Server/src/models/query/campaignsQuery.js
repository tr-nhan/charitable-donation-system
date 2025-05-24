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

        const conditions = keys.map((key, index) => `cp.${key} = $${index + 1}`);
        const query = `SELECT cp.*, ctg.*, cu.title AS latest_title, cu.content AS latest_content, cu.update_image AS latest_image, cu.update_number AS update_time
        FROM campaigns cp
        INNER JOIN campaign_categories ctg ON cp.category_id = ctg.category_id
        LEFT JOIN LATERAL (
            SELECT * FROM campaign_updates cu
            WHERE cu.campaign_id = cp.campaign_id
            ORDER BY cu.update_number DESC
            LIMIT 1
        ) cu ON true
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

const getDonations = async (filter, page = 1, limit = 5) => {
    try {
        const keys = Object.keys(filter);
        const values = Object.values(filter);

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(" AND ");
        const whereClause = conditions ? `WHERE ${conditions}` : "";

        const baseQuery = `FROM donations cpr ${whereClause}`;

        // Pagination offset
        const offset = (page - 1) * limit;
        const dataQuery = `
            SELECT * 
            ${baseQuery}
            ORDER BY created_at DESC
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        const summaryQuery = `
            SELECT 
                COALESCE(SUM(fiat_amount), 0) AS total_fiat,
                COALESCE(SUM(crypto_amount), 0) AS total_crypto,
                COUNT(*) AS total_count
            ${baseQuery}
        `;

        const queryParams = [...values, limit, offset];

        const [dataResult, summaryResult] = await Promise.all([
            pool.query(dataQuery, queryParams),
            pool.query(summaryQuery, values)
        ]);

        return {
            donations: dataResult.rows,
            summary: summaryResult.rows[0],
            page,
            limit
        };
    } catch (error) {
        console.error("Error filtering campaign donations:", error);
        throw error;
    }
};

const insertCampaign = async (campaignData) => {
    try {
        const query = `
            INSERT INTO campaigns 
            (creator_id, title, description, goal_fiat, goal_crypto, start_date, end_date, campaign_image, category_id) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [
            campaignData.creator_id,
            campaignData.title,
            campaignData.description,
            campaignData.goal_fiat,
            campaignData.goal_crypto,
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

const insertReaction = async (reactionData) => {
    try {
        const query = `
            INSERT INTO campaign_reactions (user_id, campaign_id, reaction_type)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [reactionData.userId, reactionData.campaignId, reactionData.reactionType];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting campaign reaction:", error);
        throw new Error("Database error");
    }
};

const updateReaction = async (reactionData) => {
    try {
        const query = `
            UPDATE campaign_reactions
            SET reaction_type = $1
            WHERE user_id = $2 AND campaign_id = $3
            RETURNING *;
        `;

        const values = [reactionData.reactionType, reactionData.userId, reactionData.campaignId];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating campaign reaction:", error);
        throw new Error("Database error");
    }
};

const deleteReaction = async (reactionData) => {
    try {
        const query = `
            DELETE FROM campaign_reactions
            WHERE user_id = $1 AND campaign_id = $2
            RETURNING *;
        `;

        const values = [reactionData.userId, reactionData.campaignId];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting campaign reaction:", error);
        throw new Error("Database error");
    }
};

module.exports = {
    getCategoriesCampaigns,
    insertCampaign,
    getCampaignsFilter,
    getCampaignImgs,
    getCampaignReactions,
    getDonations,
    insertReaction,
    updateReaction,
    deleteReaction
};
