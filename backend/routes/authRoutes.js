const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, switchMode, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/mode", protect, switchMode);
router.put("/profile", protect, updateProfile);

module.exports = router;