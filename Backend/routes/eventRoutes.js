const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware"); // Assuming you have an auth middleware
const {
  getAllEvents,
  getFilteredEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// Base route: /api/events

// Get all events
router.get("/", protect, getAllEvents);

// Get filtered events
router.get("/filter", protect, getFilteredEvents);

// Get single event by ID
router.get("/:id", protect, getEventById);

// Create a new event
router.post("/", protect, createEvent);

// Update event
router.put("/:id", protect, updateEvent);

// Delete event
router.delete("/:id", protect, deleteEvent);

module.exports = router;
