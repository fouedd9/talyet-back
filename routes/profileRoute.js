const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMyprofile,
  editMyProfile,
  editMyPhone,
  editMyBio,
} = require("../controllers/profileController");
const router = express.Router();
router.get("/me", authMiddleware, getMyprofile);
// editer mon profil
router.put("/me", editMyProfile);
router.patch("/me/newphone", editMyPhone);
router.patch("/me/bio", editMyBio);

module.exports = router;
