const express = require("express");
const { protect, restrictTo } = require("../middlewares/authMiddleware");
const projectController = require("../controllers/projectsController");

const router = express.Router();

// Protect routes, allowing only authenticated architects
router.use(protect, restrictTo("architect"));

// Project search route
router.get("/search", projectController.searchProjects);

// Project management routes
router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.put("/:projectId", projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);
router.get("/:projectId", projectController.getProjectById);

// Client-specific projects
router.get("/client/:clientId", projectController.getProjectsByClient);

// Like/Unlike routes
router.post("/:projectId/like", projectController.likeProject);
router.get("/:projectId/likes", projectController.getProjectLikesCount);

module.exports = router;
