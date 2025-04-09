const express = require("express");
const dashboardController = require("../controllers/TasksController");

const router = express.Router();

// 🔹 Routes des Tâches (Kanban)
router.post("/tasks", dashboardController.createTask);
router.get("/tasks", dashboardController.getAllTasks);
router.put("/tasks/:id", dashboardController.updateTask);
router.delete("/tasks/:id", dashboardController.deleteTask);

module.exports = router;
