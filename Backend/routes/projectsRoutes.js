const express = require("express");
const {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getAllProjects,
  searchProjects,
  likeProject,
  getProjectLikesCount,
  getProjectsByArchitect,
} = require("../controllers/projectsController");

const router = express.Router();

// Middleware to protect routes (ensure user is authenticated)
// Assuming you have an auth middleware that sets req.user
const { protect } = require("../middlewares/authMiddleware");

// **Search Projects - MUST come before /:projectId route**
router.get("/search", searchProjects); // Search projects with filters

// **Project Management Routes**
router.post("/", protect, createProject); // Create a new project
router.put("/:projectId", protect, updateProject); // Update a project
router.delete("/:projectId", protect, deleteProject); // Delete a project
router.get("/", protect, getAllProjects); // Get all projects
router.get("/:projectId", protect, getProjectById); // Get project by ID
router.get("/architect", protect, getProjectsByArchitect); // Get projects for the logged-in architect

// **Like/Unlike Routes**
router.post("/:projectId/like", protect, likeProject); // Like/unlike a project
router.get("/:projectId/likes", protect, getProjectLikesCount); // Get likes count for a project

module.exports = router;
