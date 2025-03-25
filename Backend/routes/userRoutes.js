const express = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} = require("../controllers/userController");

const router = express.Router();

// Middleware to set req.baseRole dynamically
router.use((req, res, next) => {
  if (req.baseUrl.includes("clients")) {
    req.baseRole = "client";
  } else if (req.baseUrl.includes("architects")) {
    req.baseRole = "architect";
  } else {
    req.baseRole = null; // Default case (fallback)
  }
  console.log(`🔍 Request received at: ${req.baseUrl} - Role: ${req.baseRole}`);
  next();
});
router.get("/check-auth", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.oidc.user,
    });
  } else {
    return res.status(200).json({
      isAuthenticated: false,
      user: {},
    });
  }
});
// Routes that automatically use req.baseRole
router.get("/stats", getUserStats);
router.get("/", (req, res) => getUsers(req, res, req.baseRole));
router.post("/", (req, res) => createUser(req, res, req.baseRole));
router.get("/:id", (req, res) => getUserById(req, res, req.baseRole));
router.put("/:id", (req, res) => updateUser(req, res, req.baseRole));
router.delete("/:id", (req, res) => deleteUser(req, res, req.baseRole));


module.exports = router;
