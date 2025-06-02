const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.URL_CONNECT_TO_SUPABASE,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
});

// const updateDb = async () => {
//     const query = `SELECT * FROM users`;
//     const res = await pool.query(query);
//     console.log(res);
// };

// updateDb()

console.log("Database pool has been initialized!");

module.exports = pool;
