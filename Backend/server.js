require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

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
      console.log("Admin already exists");
      return;
    }

    const adminUserDetails = {
      pseudo: "admin",
      nomDeFamille: "admin",
      prenom: "admin",
      email: adminEmail,
      password: "123456789",
      phoneNumber: "22334455",
      role: "SuperAdmin",
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

// Basic CRUD Routes (Add more as needed)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello, Roua! Express & MongoDB are working 🚀");
});
