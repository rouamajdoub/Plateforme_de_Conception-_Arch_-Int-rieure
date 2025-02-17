const Category = require("../models/Category");

// Ajouter une catégorie
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({ name });
    await category.save();

    res
      .status(201)
      .json({ message: "Catégorie ajoutée avec succès", category });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer toutes les catégories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer une catégorie
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { addCategory, getCategories, deleteCategory };
