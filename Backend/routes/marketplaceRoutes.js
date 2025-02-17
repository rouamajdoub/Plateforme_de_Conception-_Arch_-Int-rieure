const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

router.post("/products", productController.createProduct);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
