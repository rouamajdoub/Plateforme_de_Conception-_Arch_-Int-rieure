const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ 1. Inscription (Signup)
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
    const authToken = await user.generateAuthToken(); // Generate token after saving
    await user.save(); // Save the user after token generation
    res
      .status(201)
      .json({ user, authToken, message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 2. Connexion (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting to log in with: ${email}`);

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Check password match
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
