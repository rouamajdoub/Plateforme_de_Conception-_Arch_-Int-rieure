const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 🔹 Générer un JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Expire en 7 jours
  );
};

// ✅ 1. Inscription (Signup)
exports.register = async (req, res) => {
  try {
    const { pseudo, nomDeFamille, prenom, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      pseudo,
      nomDeFamille,
      prenom,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 2. Connexion (Login)

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting to log in with: ${email}`);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    console.log("User found:", user);

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Augmenter à 7 jours pour éviter une expiration rapide
    );

    res.json({ message: "Connexion réussie", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

// ✅ 3. Récupérer le profil utilisateur
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

// ✅ 4. Déconnexion (Logout)
exports.logout = (req, res) => {
  res.json({ message: "Déconnexion réussie" });
};
