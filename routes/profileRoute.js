const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getMyprofile } = require("../controllers/profileController");
const router = express.Router();
router.get("/me", authMiddleware, getMyprofile);
