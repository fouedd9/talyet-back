const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
// const authMiddleware = require("../middlewares/authMiddleware");

// public
router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post("/refresh", authCtrl.refresh);
router.post("/logout", authCtrl.logout);

// protected
router.get("/dashboard", authMiddleware, authCtrl.dashboard);

module.exports = router;
