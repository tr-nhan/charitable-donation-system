const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
});

// const updateDB = async () => {
//     const query = `
//         CREATE TABLE IF NOT EXISTS campaign_reactions (
//     id UUID PRIMARY KEY,
//     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
//     campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
//     reaction_type VARCHAR(10) CHECK (reaction_type IN ('like', 'dislike', 'angry')),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(user_id, campaign_id)
// );


//     `;

//     try {
//         await pool.query(query);
//         console.log("Schema updated successfully");
//     } catch (error) {
//         console.error("Error updating schema:", error);
//     }
// };

// updateDB();

console.log("Database pool has been initialized!");

module.exports = pool;
