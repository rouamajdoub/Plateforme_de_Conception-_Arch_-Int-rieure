const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const ProductReview = require("../models/ProductReviews");

// ✅ 1. Ajouter un produit
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 2. Récupérer tous les produits (avec option de filtrage par catégorie)
exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).populate("category seller", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 3. Récupérer un produit par son ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category seller");
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 4. Modifier un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 5. Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit non trouvé" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 6. Passer une commande
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 7. Récupérer toutes les commandes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("buyer products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 8. Récupérer une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("buyer products.product");
    if (!order) return res.status(404).json({ error: "Commande non trouvée" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 9. Ajouter une catégorie
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 10. Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 11. Ajouter un avis sur un produit
exports.addProductReview = async (req, res) => {
  try {
    const review = new ProductReview(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 12. Récupérer les avis d’un produit
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ productId: req.params.productId }).populate("userId", "nom prenom");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
