const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Get dashboard statistics for a user
router.get(
  "/dashboard/:userId",
  authMiddleware,
  statsController.getDashboardStats
);

// Record a profile view
router.post("/profile-view/:profileId", statsController.incrementProfileViews);

// Get comparison statistics (current month vs previous month)
router.get(
  "/comparison/:userId",
  authMiddleware,
  statsController.getComparisonStats
);

module.exports = router;
