const ProductReview = require("../models/productReviews");

// Ajouter un avis sur un produit
const addProductReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    const review = new ProductReview({
      userId,
      productId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Avis ajouté avec succès", review });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer les avis d'un produit
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId }).populate(
      "userId",
      "name"
    );

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer un avis (par admin ou auteur)
const deleteProductReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await ProductReview.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { addProductReview, getProductReviews, deleteProductReview };
