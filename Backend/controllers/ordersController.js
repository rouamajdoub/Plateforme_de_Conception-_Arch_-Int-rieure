const Order = require("../models/Order");

// Ajouter une commande
const addOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, status } = req.body;

    const order = new Order({
      userId,
      products,
      totalAmount,
      status,
    });

    await order.save();
    res.status(201).json({ message: "Commande passée avec succès", order });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer toutes les commandes d'un utilisateur
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("products.productId");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour le statut d'une commande
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Statut mis à jour", order });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { addOrder, getUserOrders, updateOrderStatus };
