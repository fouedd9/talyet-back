const { getMyProfileById } = require("../models/profileModel");

async function getMyprofile(req, res) {
  try {
    const userId = req.query.id;
    console.log({ userId });
    const request = await getMyProfileById(userId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "user Introuvable" });
    }
    console.log(request);
    const { password: _, ...safeUser } = request;
    return res.json({ success: true, userConnected: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: "ERRORsss SERVER" });
  }
}
module.exports = { getMyprofile };
