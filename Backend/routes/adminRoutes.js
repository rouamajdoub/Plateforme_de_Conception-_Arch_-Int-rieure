const express = require("express");
const router = express.Router();
const { registerAdmin } = require("../controllers/authController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Admin registration route (protected with admin secret key)
router.post("/register", registerAdmin);

// Admin management routes (protected, only accessible by super admins)
router.get("/", protect, restrictTo("admin"), (req, res) => {
  // Get all admins logic here
});

module.exports = router;
