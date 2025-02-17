const express = require("express");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

// 🔹 Routes des Tâches (Kanban)
router.post("/tasks", dashboardController.createTask);
router.get("/tasks", dashboardController.getAllTasks);
router.put("/tasks/:id", dashboardController.updateTask);
router.delete("/tasks/:id", dashboardController.deleteTask);

// 🔹 Routes des Événements
router.post("/events", dashboardController.createEvent);
router.get("/events", dashboardController.getAllEvents);

// 🔹 Routes des Notifications
router.post("/notifications", dashboardController.createNotification);
router.get("/notifications/:userId", dashboardController.getUserNotifications);
router.put(
  "/notifications/:id/read",
  dashboardController.markNotificationAsRead
);

module.exports = router;
