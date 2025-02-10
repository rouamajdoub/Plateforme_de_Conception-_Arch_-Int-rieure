const User = require("../models/User");
const Admin = require("../models/Admin");
const Architect = require("../models/Architect");
const Client = require("../models/Client");

// Create User (automatically handles discriminators)
exports.createUser = async (req, res) => {
  try {
    if (!req.body.role) {
      return res.status(400).json({ error: "Role is required" });
    }

    let newUser;
    const role = req.body.role.toLowerCase(); // Ensure lowercase

    switch (role) {
      case "admin":
        newUser = new User(req.body, { discriminatorKey: "admin" });
        break;
      case "architect":
        newUser = new User(req.body, { discriminatorKey: "architect" });
        break;
      case "client":
        newUser = new User(req.body, { discriminatorKey: "client" });
        break;
      default:
        return res
          .status(400)
          .json({
            error: "Invalid role. Must be 'admin', 'architect', or 'client'",
          });
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
    const { role } = req.query;
    const filter = role ? { role: role.toLowerCase() } : {};
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single user by ID
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

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send(); // No content (successful deletion)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
