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
  getProjectsByClient,
} = require("../controllers/projectsController");

const router = express.Router();

// Middleware to protect routes (ensure user is authenticated)
// Assuming you have an auth middleware that sets req.user
const { protect } = require("../middlewares/authMiddleware");

// **Search Route** - Must come before other routes with parameters
router.get("/search", searchProjects); // Search projects with filters

// **Specific Routes** - These must come before general parameter routes
router.get("/architect", protect, getProjectsByArchitect); // Get projects for the logged-in architect
router.get("/client/:clientId/:clientType", protect, getProjectsByClient); // Get projects for a specific client

// **Project Management Routes**
router.post("/", protect, createProject); // Create a new project
router.get("/", protect, getAllProjects); // Get all projects

// **Project Detail Routes with ID parameter**
router.put("/:projectId", protect, updateProject); // Update a project
router.delete("/:projectId", protect, deleteProject); // Delete a project
router.get("/:projectId", protect, getProjectById); // Get project by ID

// **Like/Unlike Routes**
router.post("/:projectId/like", protect, likeProject); // Like/unlike a project
router.get("/:projectId/likes", protect, getProjectLikesCount); // Get likes count for a project

module.exports = router;
