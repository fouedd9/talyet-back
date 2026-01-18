const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMyprofile,
  editMyProfile,
  editMyPhone,
  editMyBio,
  getAllRoles,
  changeUserRole,
} = require("../controllers/profileController");
const router = express.Router();
router.get("/me", authMiddleware, getMyprofile);
// editer mon profil
router.put("/me", editMyProfile);
router.patch("/me/newphone", authMiddleware, editMyPhone);
router.patch("/me/bio", authMiddleware, editMyBio);
router.get("/me/roles", authMiddleware, getAllRoles);
router.patch("/me/roles/change_user_role", authMiddleware, changeUserRole);

module.exports = router;
