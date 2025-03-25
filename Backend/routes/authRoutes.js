const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  logout,
  googleLogin,
  checkAuth,
} = require("../controllers/authController"); // Ensure correct path

// Auth Status Check
router.get("/check", checkAuth);

// Registration
router.post("/register", register);

// Login routes
router.post("/login", login);
router.post("/google-login", googleLogin);

// Profile (Protected)
router.get("/profile/:id", getProfile);

// Logout
router.post("/logout", logout);

module.exports = router;
