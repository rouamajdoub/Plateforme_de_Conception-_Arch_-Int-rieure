const express = require("express");
const {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getAllProjects,
  searchProjects,
  likeProject, // Add this import
  getProjectLikesCount, // Add this import
} = require("../controllers/projectsController");

const router = express.Router();

// **Search Projects - MUST come before /:projectId route**
router.get("/search", searchProjects); // Search projects with filters

// **Project Management Routes**
router.post("/", createProject); // Create a new project
router.put("/:projectId", updateProject); // Update a project
router.delete("/:projectId", deleteProject); // Delete a project
router.get("/", getAllProjects); // Get all projects
router.get("/:projectId", getProjectById); // Get project by ID

// **Like/Unlike Routes**
router.post("/:projectId/like", likeProject);
router.get("/:projectId/likes", getProjectLikesCount);

module.exports = router;
