require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const Architect = require("./models/Architect");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      // Check and create admin user after server starts
      setTimeout(createAdminIfNotExists, 1000);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Function to create admin user
async function createAdminIfNotExists() {
  const adminEmail = "admin@admin.com";
  try {
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("✅ Admin already exists");
      return;
    }

    const adminUserDetails = {
      pseudo: "admin",
      nomDeFamille: "admin",
      prenom: "admin",
      email: adminEmail,
      password: "123456789", // ⚠️ Change later when adding bcrypt
      phoneNumber: "22334455",
      role: "admin",
      birthDate: new Date("1999-10-10"),
      pays: "France",
      region: "Ile-de-France",
      codeParrainage: "ADMIN123",
      contentTerm: true,
      cgvAndCguTerm: true,
      infoTerm: true,
      majorTerm: true,
      exterieurParticipantTerm: true,
    };

    const adminUser = new User(adminUserDetails);
    await adminUser.save();
    console.log("✅ Admin user created successfully");
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
}

// ✅ Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create a new user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Get all architects
app.get("/architects", async (req, res) => {
  try {
    const architects = await Architect.find();
    res.json(architects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Create a new architect
app.post("/architects", async (req, res) => {
  try {
    const newArchitect = new Architect(req.body);
    await newArchitect.save();
    res.status(201).json(newArchitect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Get a specific architect by ID
app.get("/architects/:id", async (req, res) => {
  try {
    const architect = await Architect.findById(req.params.id);
    if (!architect)
      return res.status(404).json({ message: "Architect not found" });
    res.json(architect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update an architect
app.put("/architects/:id", async (req, res) => {
  try {
    const updatedArchitect = await Architect.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedArchitect)
      return res.status(404).json({ message: "Architect not found" });
    res.json(updatedArchitect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete an architect
app.delete("/architects/:id", async (req, res) => {
  try {
    const deletedArchitect = await Architect.findByIdAndDelete(req.params.id);
    if (!deletedArchitect)
      return res.status(404).json({ message: "Architect not found" });
    res.json({ message: "Architect deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello, Roua! Express & MongoDB are working 🚀");
});
