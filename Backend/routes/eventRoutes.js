const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getAllEvents,
  getFilteredEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.get("/", protect, getAllEvents);
router.get("/filter", protect, getFilteredEvents);
router.get("/:id", protect, getEventById);
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
