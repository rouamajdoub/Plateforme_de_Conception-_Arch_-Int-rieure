const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const ProductReview = require("../models/ProductReview");

// Product CRUD Operations
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, images } = req.body;

    // Get seller ID from authenticated user
    const seller = req.user._id;

    const newProduct = new Product({
      name,
      description,
      price,
      seller,
      category,
      stock: stock || 0,
      images: images || [],
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "pseudo email")
      .populate("category", "name");

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId || req.user._id;

    // Check if sellerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid seller ID format." });
    }

    const products = await Product.find({ seller: sellerId }).populate(
      "category",
      "name"
    );

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving seller products:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("seller", "pseudo email")
      .populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id;

    // Ensure only the seller can update their product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== sellerId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id;

    // Ensure only the seller can delete their product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== sellerId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Product Reviews Operations
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId }).populate(
      "client",
      "pseudo nomDeFamille"
    );

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error retrieving product reviews:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Order Operations
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Find orders containing products sold by this seller
    const orders = await Order.find({
      "products.product": {
        $in: await Product.find({ seller: sellerId }).distinct("_id"),
      },
    })
      .populate({
        path: "products.product",
        select: "name price images",
        match: { seller: sellerId },
      })
      .populate("buyer", "pseudo email");

    // Filter out products not sold by this seller
    const filteredOrders = orders.map((order) => {
      const sellerProducts = order.products.filter(
        (item) => item.product !== null
      );

      // Calculate total amount for just this seller's products
      const sellerTotal = sellerProducts.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      return {
        _id: order._id,
        buyer: order.buyer,
        products: sellerProducts,
        sellerTotal,
        status: order.status,
        createdAt: order.createdAt,
      };
    });

    return res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error retrieving seller orders:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Category Operations
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Product Statistics
exports.getSellerProductStats = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get total product count
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Get total orders count
    const productIds = await Product.find({ seller: sellerId }).distinct("_id");
    const totalOrders = await Order.countDocuments({
      "products.product": { $in: productIds },
    });

    // Get top selling products
    const products = await Product.find({ seller: sellerId });

    // Get all orders containing seller's products
    const orders = await Order.find({
      "products.product": { $in: productIds },
    });

    // Calculate sales per product
    const productSales = {};
    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (productIds.some((id) => id.equals(item.product))) {
          if (productSales[item.product]) {
            productSales[item.product] += item.quantity;
          } else {
            productSales[item.product] = item.quantity;
          }
        }
      });
    });

    // Sort products by sales
    const topProducts = Object.entries(productSales)
      .map(([productId, sales]) => ({
        product: products.find((p) => p._id.equals(productId)),
        sales,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 products

    return res.status(200).json({
      totalProducts,
      totalOrders,
      topProducts,
    });
  } catch (error) {
    console.error("Error retrieving product statistics:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
