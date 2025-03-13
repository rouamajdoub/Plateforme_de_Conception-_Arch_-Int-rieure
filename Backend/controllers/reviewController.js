const ProductReview = require("../models/ProductReview");
const ProjectReview = require("../models/ProjectReview");

// Create Product Review
exports.createProductReview = async (req, res) => {
  try {
    const { client, comment, rating, productId } = req.body;

    const newReview = new ProductReview({
      client,
      comment,
      rating,
      productId,
    });

    await newReview.save();
    return res
      .status(201)
      .json({
        message: "Product review created successfully!",
        review: newReview,
      });
  } catch (error) {
    console.error("Error creating product review:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Create  Project Review
exports.createProjectReview = async (req, res) => {
  try {
    const { client, comment, rating, projectId } = req.body;

    const newReview = new ProjectReview({
      client,
      comment,
      rating,
      projectId,
    });

    await newReview.save();
    return res
      .status(201)
      .json({
        message: "Project review created successfully!",
        review: newReview,
      });
  } catch (error) {
    console.error("Error creating project review:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Retrieve all Product Reviews
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find().populate(
      "client",
      "pseudo nomDeFamille"
    ); // Populate client info
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error retrieving product reviews:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Retrieve all Project Reviews
exports.getProjectReviews = async (req, res) => {
  try {
    const reviews = await ProjectReview.find().populate(
      "client",
      "pseudo nomDeFamille"
    ); 
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error retrieving project reviews:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update a Product Review
exports.updateProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await ProductReview.findByIdAndUpdate(
      reviewId,
      req.body,
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Product review not found" });
    }

    return res
      .status(200)
      .json({
        message: "Product review updated successfully!",
        review: updatedReview,
      });
  } catch (error) {
    console.error("Error updating product review:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update a Project Review
exports.updateProjectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await ProjectReview.findByIdAndUpdate(
      reviewId,
      req.body,
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Project review not found" });
    }

    return res
      .status(200)
      .json({
        message: "Project review updated successfully!",
        review: updatedReview,
      });
  } catch (error) {
    console.error("Error updating project review:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Delete a Product Review
exports.deleteProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await ProductReview.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Product review not found" });
    }

    return res
      .status(200)
      .json({ message: "Product review deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product review:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Delete a Project Review
exports.deleteProjectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await ProjectReview.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Project review not found" });
    }

    return res
      .status(200)
      .json({ message: "Project review deleted successfully!" });
  } catch (error) {
    console.error("Error deleting project review:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
// Retrieve all reviews (both product and project)
exports.getAllReviews = async (req, res) => {
  try {
    const productReviews = await ProductReview.find().populate(
      "client",
      "pseudo nomDeFamille"
    );
    const projectReviews = await ProjectReview.find().populate(
      "client",
      "pseudo nomDeFamille"
    );

    const allReviews = {
      productReviews,
      projectReviews,
    };

    return res.status(200).json(allReviews);
  } catch (error) {
    console.error("Error retrieving all reviews:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
