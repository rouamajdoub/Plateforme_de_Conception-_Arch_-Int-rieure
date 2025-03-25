const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create reviews
router.post("/products", reviewController.createProductReview);
router.post("/projects", reviewController.createProjectReview);

// Get reviews
router.get("/products", reviewController.getProductReviews);
router.get("/projects", reviewController.getProjectReviews);
router.get("/", reviewController.getAllReviews);

// Update reviews
router.put("/products/:reviewId", reviewController.updateProductReview);
router.put("/projects/:reviewId", reviewController.updateProjectReview);

// Delete reviews
router.delete("/products/:reviewId", reviewController.deleteProductReview);
router.delete("/projects/:reviewId", reviewController.deleteProjectReview);

module.exports = router;
