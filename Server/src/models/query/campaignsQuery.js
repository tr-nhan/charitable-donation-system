const e = require("express");
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
        const query = `SELECT cp.*, ctg.*, cu.title AS latest_title, cu.content AS latest_content, cu.update_number AS update_time
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

const getUpdatedInfo = async (campaignId) => {
    try {
        const query = `
            SELECT * 
            FROM campaign_updates
            WHERE campaign_id = $1
            ORDER BY update_number DESC;
        `;

        const result = await pool.query(query, [campaignId]);
        return result.rows;
    } catch (error) {
        console.error("Error fetching campaign updates:", error);
        throw new Error("Database error");
    }
};

const insertUpdateInfo = async (updateData) => {
    try {
        const getMaxQuery = `
            SELECT COALESCE(MAX(update_number), 0) AS max_update_number
            FROM campaign_updates
            WHERE campaign_id = $1;
        `;
        const maxResult = await pool.query(getMaxQuery, [updateData.campaignId]);
        const nextUpdateNumber = maxResult.rows[0].max_update_number + 1;

        const query = `
            INSERT INTO campaign_updates (campaign_id, author_id, title, content, update_number)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [
            updateData.campaignId,
            updateData.authorId,
            updateData.title,
            updateData.content,
            nextUpdateNumber
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting campaign update:", error);
        throw new Error("Database error");
    }
};

const updateCampaignImages = async (campaignId, newImagesString) => {
    try {
        const checkQuery = `SELECT image_url FROM campaign_images WHERE campaign_id = $1`;
        const checkResult = await pool.query(checkQuery, [campaignId]);

        let finalImageString;

        if (checkResult.rowCount === 0) {
            const insertQuery = `
                INSERT INTO campaign_images (campaign_id, image_url)
                VALUES ($1, $2)
                RETURNING *;
            `;
            const insertResult = await pool.query(insertQuery, [campaignId, newImagesString]);
            return insertResult.rows[0];
        } else {
            const existingImages = checkResult.rows[0].image_url;

            finalImageString = existingImages
                ? `${existingImages},${newImagesString}`
                : newImagesString;

            const updateQuery = `
                UPDATE campaign_images
                SET image_url = $1
                WHERE campaign_id = $2
                RETURNING *;
            `;
            const updateResult = await pool.query(updateQuery, [finalImageString, campaignId]);
            return updateResult.rows[0];
        }
    } catch (error) {
        console.error("Error updating/inserting campaign images:", error);
        throw new Error("Database error");
    }
};

const filterCampaignsWithPagination = async (q, fromGoal, toGoal, categoryId, page = 0) => {
    try {
        const limit = 20;
        const offset = (page - 1) * limit;
        
        // Build dynamic filters
        const conditions = [];
        const values = [];
        let index = 1;

        if (q) {
            conditions.push(`(
                LOWER(c.title) LIKE LOWER($${index}) OR
                LOWER(c.description) LIKE LOWER($${index}) OR
                LOWER(u.full_name) LIKE LOWER($${index})
            )`);
            values.push(`%${q}%`);
            index++;
        }

        if (fromGoal !== undefined) {
            conditions.push(`c.goal_fiat >= $${index}`);
            values.push(fromGoal);
            index++;
        }

        if (toGoal !== undefined) {
            conditions.push(`c.goal_fiat <= $${index}`);
            values.push(toGoal);
            index++;
        }

        if (categoryId) {
            conditions.push(`c.category_id = $${index}`);
            values.push(categoryId);
            index++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        // Query to count total matching records
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM campaigns c
            JOIN users u ON c.creator_id = u.user_id
            ${whereClause}
        `;
        const countResult = await pool.query(countQuery, values);
        const total = parseInt(countResult.rows[0].total, 10);
        const totalPage = page === 0 ? 1 : Math.ceil(total / limit);

        // Query to get actual data
        const dataQuery = `
            SELECT 
                c.campaign_id,
                c.title,
                c.description,
                c.campaign_image,
                c.goal_fiat,
                c.goal_crypto,
                c.current_fiat,
                c.current_crypto,
                u.user_id,
                u.full_name
            FROM campaigns c
            JOIN users u ON c.creator_id = u.user_id
            ${whereClause}
            ${page === 0 ? "" : `LIMIT ${limit} OFFSET ${offset}`}
        `;
        const dataResult = await pool.query(dataQuery, values);

        return {
            total,
            totalPage,
            data: dataResult.rows
        };
    } catch (error) {
        console.error("Error filtering campaigns:", error);
        throw new Error("Database query failed");
    }
};

const getCampaignBalanceQuery = async (campaignId) => {
    try {
        const query = `
        SELECT cb.campaign_id, cb.fiat_amount, cb.crypto_amount, c.goal_fiat, c."isSuspend"
        FROM campaign_balances cb
        INNER JOIN campaigns c ON c.campaign_id = cb.campaign_id
        WHERE cb.campaign_id = $1
        `;

        const result = await pool.query(query, [campaignId]);

        return result;
    } catch (error) {
        console.log(error);
    }
};

const updateCampaignBalanceQuery = async (campaignId, status, amount) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check if campaign balance exists
        const checkQuery = `SELECT fiat_amount FROM campaign_balances WHERE campaign_id = $1`;
        const checkResult = await client.query(checkQuery, [campaignId]);

        if (checkResult.rowCount === 0) {
            // If not exist, insert new record
            const initialAmount = status === "inc" ? amount : -amount;

            if (initialAmount < 0) {
                throw new Error("Cannot insert with negative fiat_amount.");
            }

            const insertQuery = `
                INSERT INTO campaign_balances (campaign_id, fiat_amount)
                VALUES ($1, $2)
            `;
            await client.query(insertQuery, [campaignId, initialAmount]);
        } else {
            // If exists, update it
            const currentAmount = parseFloat(checkResult.rows[0].fiat_amount);
            const newAmount = status === "inc" ? currentAmount + amount : currentAmount - amount;

            if (newAmount < 0) {
                throw new Error("Fiat amount cannot be negative.");
            }

            const updateQuery = `
                UPDATE campaign_balances
                SET fiat_amount = $1
                WHERE campaign_id = $2
            `;
            await client.query(updateQuery, [newAmount, campaignId]);
        }

        await client.query("COMMIT");
        return { success: true };
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("updateCampaignBalanceQuery error:", error);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
};

const insertReportCampaignQuery = async (r) => {
    try {
        const query = `
        INSERT INTO campaign_reports
        (campaign_id, report_text, report_images, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;

        const res = await pool.query(query, [
            r.campaignId,
            r.reportText,
            r.reportImages,
            r.reporterId
        ]);

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getReportByCampaignId = async (campaignId) => {
    try {
        const query = `
            SELECT * FROM campaign_reports
            WHERE campaign_id = $1
            ORDER BY created_at DESC
        `;

        const res = await pool.query(query, [campaignId]);
        return res.rows;
    } catch (error) {
        console.error("Error fetching campaign reports:", error);
        throw error;
    }
};

const getCampaignInfoFollowReportQuery = async () => {
    try {
        const query = `
            SELECT 
            c.campaign_id,
            c.title, 
            c.campaign_image, 
            COUNT(r.id) AS report_count
            FROM campaign_reports r
            JOIN campaigns c ON r.campaign_id = c.campaign_id
            GROUP BY c.campaign_id, c.title, c.campaign_image
            HAVING COUNT(r.id) > 0
            ORDER BY report_count DESC;
        `;

        const res = await pool.query(query);
        return res.rows;
    } catch (error) {
        console.error("Failed to fetch reported campaigns:", error);
        return [];
    }
};

const updateCampaignSuspendStatusQuery = async (status, campaignId) => {
    try {
        const query = `
        UPDATE campaigns
        SET "isSuspend" = $1
        WHERE campaign_id = $2
        `;

        await pool.query(query, [status, campaignId]);
    } catch (error) {
        console.log(error);
    }
};

const updateMetamaskAddQuery = async (add, campaignId) => {
    try {
        const query = `
        UPDATE campaigns
        SET metamask_add = $1
        WHERE campaign_id = $2
        `;

        await pool.query(query, [add, campaignId]);

        return { error: 0 };
    } catch (error) {
        console.log(error);
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
    deleteReaction,
    getUpdatedInfo,
    insertUpdateInfo,
    updateCampaignImages,
    filterCampaignsWithPagination,
    getCampaignBalanceQuery,
    updateCampaignBalanceQuery,
    insertReportCampaignQuery,
    getReportByCampaignId,
    getCampaignInfoFollowReportQuery,
    updateCampaignSuspendStatusQuery,
    updateMetamaskAddQuery
};
