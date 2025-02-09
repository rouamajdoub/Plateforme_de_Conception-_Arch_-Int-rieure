const User = require("../models/User");
const Admin = require("../models/Admin");
const Architect = require("../models/Architect");
const Client = require("../models/Client");

// Create User (automatically handles discriminators)
exports.createUser = async (req, res) => {
  try {
    let newUser;
    switch (req.body.role) {
      case "Admin":
        newUser = new Admin(req.body);
        break;
      case "Architect":
        newUser = new Architect(req.body);
        break;
      case "Client":
        newUser = new Client(req.body);
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Users (with optional filtering)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
