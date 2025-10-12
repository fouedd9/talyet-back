const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function createAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1m" });
}
function createRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "1d" });
}
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
