const express = require("express");
const marketplaceController = require("../controllers/marketplaceController");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

// 🔹 Produits
router.post("/products", marketplaceController.createProduct);
router.get("/products", marketplaceController.getAllProducts);
router.get("/products/:id", marketplaceController.getProductById);
router.put("/products/:id", marketplaceController.updateProduct);
router.delete("/products/:id", marketplaceController.deleteProduct);

// 🔹 Commandes
router.post("/orders", marketplaceController.createOrder);
router.get("/orders", marketplaceController.getAllOrders);
router.get("/orders/:id", marketplaceController.getOrderById);

// 🔹 Catégories
router.post("/categories", marketplaceController.createCategory);
router.get("/categories", marketplaceController.getAllCategories);

// 🔹 Avis produits
router.post("/product-reviews", reviewController.createProductReview);
router.get("/product-reviews", reviewController.getProductReviews);
router.put("/product-reviews/:reviewId", reviewController.updateProductReview);
router.delete(
  "/product-reviews/:reviewId",
  reviewController.deleteProductReview
);
router.get("/reviews", reviewController.getAllReviews); // Route to get all reviews

module.exports = router;
