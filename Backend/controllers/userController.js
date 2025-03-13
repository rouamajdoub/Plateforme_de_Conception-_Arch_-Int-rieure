const User = require("../models/User");
const Architect = require("../models/Architect");
const Client = require("../models/Client");
const Admin = require("../models/Admin");
const Subscription = require("../models/Subscriptions");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    console.log("📌 Requête reçue :", req.body); // 🔎 Voir les données envoyées avant d'être enregistrées

    let newUser;

    switch (req.body.role.toLowerCase()) {
      case "admin":
        newUser = new Admin(req.body);
        break;
      case "architect":
        newUser = new Architect(req.body); // ✅ Créer un `Architect` correctement
        break;
      case "client":
        newUser = new Client(req.body);
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    await newUser.save();

    // 📜 Ajouter un abonnement par défaut pour l'architecte
    if (req.body.role.toLowerCase() === "architect") {
      const subscription = new Subscription({
        architectId: newUser._id,
        plan: "Free",
        price: 0,
        endDate: null,
      });
      newUser.subscription = subscription._id;
      await subscription.save();
    }

    console.log("✅ Utilisateur enregistré :", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout :", error);
    res.status(400).json({ error: error.message });
  }
};

// 🔍 Récupérer tous les utilisateurs (avec option de filtrage par rôle)
exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Mettre à jour un utilisateur par ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ❌ Supprimer un utilisateur par ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔐 Déconnexion d'un utilisateur
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

// 🔑 Génération de token JWT pour connexion
exports.generateAuthToken = async (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.authTokens.push({ token });
  await user.save();
  return token;
};

// 📊 Get user count per month
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formattedStats = stats.map((stat) => ({
      month: `${stat._id.year}-${String(stat._id.month).padStart(2, "0")}`,
      count: stat.count,
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error("Error fetching user stats:", error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};
