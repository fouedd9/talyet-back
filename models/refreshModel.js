const pool = require("../config/db");

async function store(tokenHash, userId, expiresAt) {
  await pool.query(
    "INSERT INTO refresh_tokens(token, user_id, expires_at) VALUES($1, $2, $3)",
    [tokenHash, userId, expiresAt]
  );
}
async function findByHash(tokenHash) {
  const r = await pool.query("SELECT * FROM refresh_tokens WHERE token=$1", [
    tokenHash,
  ]);
  return r.rows[0];
}
async function deleteByHash(tokenHash) {
  const r = await pool.query("DELETE FROM refresh_tokens WHERE token=$1", [
    tokenHash,
  ]);
  return r;
}
async function deleteByUserId(userId) {
  return pool.query("DELETE FROM refresh_tokens WHERE user_id=$1", [userId]);
}

module.exports = { store, findByHash, deleteByHash, deleteByUserId };
