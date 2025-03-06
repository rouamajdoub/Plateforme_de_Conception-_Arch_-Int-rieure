const express = require("express");
const projectsController = require("../controllers/projectsController");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

// 🔹 Projects Routes
router.post("/projects", projectsController.createProject);
router.get("/projects", projectsController.getAllProjects);
router.get("/projects/:id", projectsController.getProjectById);
router.put("/projects/:id", projectsController.updateProject);
router.delete("/projects/:id", projectsController.deleteProject);

// 🔹 Project Reviews Routes
router.post("/project-reviews", reviewController.createProjectReview);
router.get("/project-reviews", reviewController.getProjectReviews);
router.put("/project-reviews/:reviewId", reviewController.updateProjectReview);
router.delete("/project-reviews/:reviewId", reviewController.deleteProjectReview);

module.exports = router;