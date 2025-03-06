const mongoose = require("mongoose");
const Review = require("./Review"); // Import the base review model

const productReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product model
      required: true,
    },
  },
  { timestamps: true }
);

// Create the discriminator
const ProductReview = Review.discriminator("ProductReview", productReviewSchema);

module.exports = ProductReview;