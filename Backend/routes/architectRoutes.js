const express = require("express");
const router = express.Router();
const architectController = require("../controllers/architectController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// All routes are protected and restricted to admin users
router.use(protect);
router.use(restrictTo("admin"));

// Get all architect requests
router.get("/requests", architectController.getArchitectRequests);

// Update architect status (approve/reject)
router.patch("/requests/:id", architectController.updateArchitectStatus);

// Get architect statistics for admin dashboard
router.get("/stats", architectController.getArchitectStats);

module.exports = router;
