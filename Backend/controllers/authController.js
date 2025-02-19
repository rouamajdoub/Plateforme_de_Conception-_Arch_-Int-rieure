//-----------------------Require-----------------------
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
// -----------------------Signup---------------------------------
exports.register = async (req, res) => {
  try {
    const { pseudo, nomDeFamille, prenom, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email déjà utilisé" });

    user = new User({
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password,
      role,
    });
    const authToken = await user.generateAuthToken();
    await user.save();
    res
      .status(201)
      .json({ user, authToken, message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//--------------------Login------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting to log in with: ${email}`);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = await user.generateAuthToken();
    res.json({ message: "Connexion réussie", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

// --------------------profile--------------------
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ----------------------------logout-----------------------------------
exports.logout = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    req.user.authTokens = req.user.authTokens.filter(
      (userToken) => userToken.token !== token
    );
    await req.user.save();

    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//----------------------Reset Password---------------------
// Demander une réinitialisation de mot de passe
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  // Configurer Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Envoyer l'email
  const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;
  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  res.json({ message: "Password reset email sent" });
};

// Réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Token is invalid or has expired" });
  }

  // Hash the new password before saving
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined; // Clear the token
  user.resetPasswordExpires = undefined; // Clear the expiration
  await user.save();

  res.json({ message: "Password has been reset successfully" });
};
