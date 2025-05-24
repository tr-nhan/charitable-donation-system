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
//     ALTER TABLE campaign_reactions
// ADD CONSTRAINT campaign_reactions_reaction_type_check
// CHECK (reaction_type IN ('heart', 'thumb_up', 'thumb_down', 'smile'));
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
