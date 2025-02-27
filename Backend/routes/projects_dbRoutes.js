const express = require("express");
const router = express.Router();

const projectsController = require("../controllers/projectsController");
const needsSheetController = require("../controllers/needsSheetController");
const matchController = require("../controllers/matchController");
const reviewController = require("../controllers/reviewController");
const quoteController = require("../controllers/quoteController");

// 🔹 Projects Routes
router.post("/projects", projectsController.createProject);
router.get("/projects", projectsController.getAllProjects);
router.get("/projects/:id", projectsController.getProjectById);
router.put("/projects/:id", projectsController.updateProject);
router.delete("/projects/:id", projectsController.deleteProject);

// 🔹 Needs Sheets Routes
router.post("/needsSheets", needsSheetController.createNeedsSheet);
router.get("/needsSheets", needsSheetController.getAllNeedsSheets);
router.get("/needsSheets/:id", needsSheetController.getNeedsSheetById);

// 🔹 Matches Routes
router.post("/matches", matchController.createMatch);
router.put("/matches/:id", matchController.updateMatchStatus);

// 🔹 Reviews Routes
router.post("/reviews", reviewController.createReview);
router.delete("/reviews/:id", reviewController.deleteReview);
router.get("/reviews", reviewController.getAllReviews);
router.get("/reviews/:projectId", reviewController.getReviewsByProject);

// 🔹 Quotes Routes
router.post("/quotes", quoteController.createQuote);
router.get("/quotes/:projectId", quoteController.getQuotesByProject);

module.exports = router;
