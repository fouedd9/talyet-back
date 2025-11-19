const {
  getMyProfileById,
  updateMyProfile,
  changeMyPhoneNumber,
  changeMyBio,
} = require("../models/profileModel");

async function getMyprofile(req, res) {
  try {
    const userId = req.query.id;

    const request = await getMyProfileById(userId);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "user Introuvable" });
    }
    const { password: _, ...safeUser } = request;
    return res.json({ success: true, userConnected: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: "ERRORsss SERVER" });
  }
}

async function editMyProfile(req, res) {
  try {
    const userId = req.query.id;
    console.log({ userId });
    const {
      address,
      age,
      bio,
      city,
      country,
      job_title,
      phone,
      profile_picture,
    } = req.body;

    const result = await updateMyProfile(userId, {
      address,
      age,
      bio,
      city,
      country,
      job_title,
      phone,
      profile_picture,
    });
    return res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      body: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
}

async function editMyPhone(req, res) {
  const newphone = req.body.phone;
  const userId = req.body.id;

  try {
    if (!newphone || !userId) {
      return res.status(404).json({ success: false, message: "error 404" });
    }
    const result = await changeMyPhoneNumber(userId, newphone);
    return res.json({
      success: true,
      message: "le numéro de téléphone a bien était changé !!!",
      response: result,
    });
  } catch (error) {
    return res.json({ error: "error server" });
  }
}
async function editMyBio(req, res) {
  const newBio = req.body.newBio;
  const userId = req.body.id;
  console.log({ newBio, userId });
  try {
    if (!newBio || !userId) {
      return res.status(404).json({ success: false, message: "error 404" });
    }
    const result = await changeMyBio(userId, newBio);
    return res.json({
      success: true,
      message: "la bio a etait bien changé !!!",
      response: result,
    });
  } catch (error) {
    return res.status(500).json({ error: "error server bio" });
  }
}

module.exports = { getMyprofile, editMyProfile, editMyPhone, editMyBio };
