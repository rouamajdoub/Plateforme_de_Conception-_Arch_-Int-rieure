const Payment = require("../models/paymentModel");
const Order = require("../models/Order");

// 📌 Créer un paiement
exports.createPayment = async (req, res) => {
  try {
    const { userId, orderId, amount, paymentMethod, transactionId } = req.body;

    // Vérifier si la commande existe
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    // Créer un nouveau paiement
    const payment = new Payment({
      userId,
      orderId,
      amount,
      paymentMethod,
      transactionId,
      status: "pending", 
    });

    await payment.save();
    res.status(201).json({ message: "Paiement créé avec succès", payment });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du paiement", error });
  }
};

// 📌 Récupérer un paiement par ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("userId orderId");
    if (!payment) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du paiement", error });
  }
};

// 📌 Mettre à jour le statut d'un paiement
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }

    payment.status = status;
    await payment.save();
    res.status(200).json({ message: "Statut du paiement mis à jour", payment });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du paiement", error });
  }
};

// 📌 Supprimer un paiement
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }
    res.status(200).json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du paiement", error });
  }
};
