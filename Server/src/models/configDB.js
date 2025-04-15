const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});

// const updateDB = async () => {
//     try {
//         await pool.query("alter table users add column if not exists private boolean default false;");
//         console.log("Success");
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }

// updateDB();

console.log("Database pool has been initialized!");

module.exports = pool;
