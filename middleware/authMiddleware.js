const { verifyAccessToken, verifyRefreshToken } = require("../utils/tokens");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!authHeader)
      return res.status(401).json({ error: "Accès refusé, token manquant" });

    if (!token)
      return res.status(401).json({ error: "Accès refusé, token manquant" });

    const payload = verifyAccessToken(token);
    req.user = payload; // { id, name, email } si tu as mis ça dans le token
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalidesss" });
  }
}

module.exports = authMiddleware;
