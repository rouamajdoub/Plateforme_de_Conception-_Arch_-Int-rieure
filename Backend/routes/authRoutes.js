const express = require("express");
const {
  register,
  login,
  getProfile,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Inscription
router.post("/register", register);

// Connexion
router.post("/login", login);

// Profil (protégé par JWT)
router.get("/profile", protect, getProfile);

// Déconnexion
router.post("/logout", protect, logout);

module.exports = router;