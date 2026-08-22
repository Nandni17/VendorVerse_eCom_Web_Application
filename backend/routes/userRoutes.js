const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// ==========================================
// GET MY PROFILE
// ==========================================

router.get(
  "/profile",
  protect,
  getMyProfile
);

// ==========================================
// UPDATE MY PROFILE
// ==========================================

router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateMyProfile
);
module.exports = router;