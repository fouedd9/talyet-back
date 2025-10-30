const pool = require("../config/db");

const getMyProfileById = async (id) => {
  const request = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  return request.rows[0];
};
module.exports = { getMyProfileById };
