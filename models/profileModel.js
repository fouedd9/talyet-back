const pool = require("../config/db");

// /me
const getMyProfileById = async (id) => {
  const request = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  return request.rows[0];
};

// modifier mon profil
const updateMyProfile = async (userId, data) => {
  const {
    address,
    age,
    bio,
    city,
    country,
    job_title,
    phone,
    profile_picture,
  } = data;

  const query = `
    UPDATE users
    SET
      address = $1,
      age = $2,
      bio = $3,
      city = $4,
      country = $5,
      job_title = $6,
      phone = $7,
      profile_picture = $8
    WHERE id = $9
  `;
  const values = [
    address,
    age,
    bio,
    city,
    country,
    job_title,
    phone,
    profile_picture,
    userId,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const changeMyPhoneNumber = async (userId, newphone) => {
  const result = await pool.query(`UPDATE users SET phone=$1 WHERE id=$2`, [
    newphone,
    userId,
  ]);
  return result.rows[0];
};

const changeMyBio = async (userId, newBio) => {
  const result = await pool.query(`UPDATE users SET bio=$1 WHERE id=$2`, [
    newBio,
    userId,
  ]);
  return result.rows[0];
};

module.exports = {
  getMyProfileById,
  updateMyProfile,
  changeMyPhoneNumber,
  changeMyBio,
};
