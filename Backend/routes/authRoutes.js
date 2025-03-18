const express = require("express");
const {
  register,
  login,
  getProfile,
  logout,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  googleLogin, // ➜ Add Google Login Controller
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Inscription
router.post("/register", register);

// Connexion
router.post("/login", login);

// Connexion avec Google OAuth
router.post("/google-login", googleLogin); // ➜ New Google Login Route

// Profil (Protégé)
router.get("/profile", protect, getProfile);

// Déconnexion (Protégé)
router.post("/logout", protect, logout);

// Réinitialisation de mot de passe
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

// Vérification de l'email
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
