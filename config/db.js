const { Pool } = require("pg");
require("dotenv").config();

let pool;

// 🔹 Si on est sur Render (production)
if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  console.log("✅ Connected to Render database");
}

// 🔹 Sinon (en local)
else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  console.log("✅ Connected to local database");
}

module.exports = pool;
