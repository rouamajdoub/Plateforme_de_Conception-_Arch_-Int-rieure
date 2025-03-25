// routes/marketplaceRoutes.js
const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Apply auth middleware to all routes
router.use(protect);

// Product CRUD routes
router.post(
  "/products",
  restrictTo("architect", "sponsor"),
  marketplaceController.createProduct
);
router.get("/products", marketplaceController.getAllProducts);
router.get(
  "/products/seller/:sellerId?",
  marketplaceController.getProductsBySeller
);
router.get("/products/:productId", marketplaceController.getProductById);
router.put(
  "/products/:productId",
  restrictTo("architect", "sponsor"),
  marketplaceController.updateProduct
);
router.delete(
  "/products/:productId",
  restrictTo("architect", "sponsor"),
  marketplaceController.deleteProduct
);

// Product Reviews routes
router.get(
  "/products/:productId/reviews",
  marketplaceController.getProductReviews
);

// Order routes
router.get(
  "/orders",
  restrictTo("architect", "sponsor"),
  marketplaceController.getSellerOrders
);

// Category routes
router.get("/categories", marketplaceController.getAllCategories);

// Product Statistics
router.get(
  "/stats",
  restrictTo("architect", "sponsor"),
  marketplaceController.getSellerProductStats
);

module.exports = router; // Ensure this line is present
