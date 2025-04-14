const express = require("express");
const dashboardController = require("../controllers/TasksController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Only authenticated users can access task routes
router.post("/tasks", dashboardController.createTask);
router.get("/tasks", dashboardController.getAllTasks);
router.put("/tasks/:id", dashboardController.updateTask);
router.delete("/tasks/:id", dashboardController.deleteTask);

module.exports = router;
