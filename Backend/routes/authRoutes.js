const express = require("express");
const {
  register,
  login,
  getProfile,
  logout,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Inscription
router.post("/register", register);

// Connexion
router.post("/login", login);

// Profil 
router.get("/profile", protect, getProfile);

// Déconnexion
router.post("/logout", protect, logout);

// Demander une réinitialisation de mot de passe
router.post("/request-password-reset", requestPasswordReset);

// Réinitialiser le mot de passe
router.post("/reset-password/:token", resetPassword);

module.exports = router;