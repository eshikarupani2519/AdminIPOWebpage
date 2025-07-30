const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  // OR you can use individual values:
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASS,
  // port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),pool
};
