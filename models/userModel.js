const pool = require("../config/db");

async function findByEmail(email) {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  return res.rows[0];
}
async function createUser({ name, email, passwordHash }) {
  const res = await pool.query(
    "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email",
    [name, email, passwordHash]
  );
  return res.rows[0];
}
async function findById(id) {
  const res = await pool.query(
    "SELECT id, name, email FROM users WHERE id=$1",
    [id]
  );
  return res.rows[0];
}

module.exports = { findByEmail, createUser, findById };
