const User = require("../models/User");
const Subscription = require("../models/Subscriptions");
const jwt = require("jsonwebtoken"); 

exports.createUser = async (req, res, role = null) => {
  try {
    let newUser;
    const userRole = role || req.body.role;
    if (!userRole) {
      return res.status(400).json({ error: "Role is required" });
    }

    const roleLower = userRole.toLowerCase();
    req.body.role = roleLower;

    if (roleLower === "architect" || roleLower === "client") {
      newUser = new User(req.body);
      await newUser.save();

      // Create a default subscription if the user is an architect
      if (roleLower === "architect") {
        const subscription = new Subscription({
          architectId: newUser._id,
          plan: "Free",
          price: 0,
          endDate: null,
        });
        newUser.subscription = subscription._id;
        await subscription.save();
      }

      return res.status(201).json(newUser);
    } else {
      return res.status(400).json({
        error: "Invalid role. Must be 'architect' or 'client'",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res, role = null) => {
  try {
    const filter = role ? { role } : {};
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res, role = null) => {
  try {
    const filter = { _id: req.params.id };
    if (role) filter.role = role;

    const user = await User.findOne(filter);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res, role = null) => {
  try {
    const filter = { _id: req.params.id };
    if (role) filter.role = role;

    const user = await User.findOneAndUpdate(filter, req.body, {
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

exports.deleteUser = async (req, res, role = null) => {
  try {
    const filter = { _id: req.params.id };
    if (role) filter.role = role;

    const user = await User.findOneAndDelete(filter);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout Functionality
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

// Function to generate a token on login
exports.generateAuthToken = async (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  user.authTokens.push({ token });
  await user.save();
  return token;
};