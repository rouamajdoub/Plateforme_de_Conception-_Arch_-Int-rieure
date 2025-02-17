const Payment = require("../models/paymentModel");
const Subscription = require("../models/Subscriptions");
const Order = require("../models/Order");

// ✅ 1. Effectuer un paiement
exports.createPayment = async (req, res) => {
  try {
    const {
      user,
      amount,
      paymentMethod,
      type,
      subscription,
      order,
      transactionId,
    } = req.body;

    if (type === "subscription" && !subscription) {
      return res
        .status(400)
        .json({
          error: "Subscription ID is required for subscription payments.",
        });
    }
    if (type === "product" && !order) {
      return res
        .status(400)
        .json({ error: "Order ID is required for product payments." });
    }

    const payment = new Payment({
      user,
      amount,
      paymentMethod,
      type,
      subscription: type === "subscription" ? subscription : undefined,
      order: type === "product" ? order : undefined,
      transactionId,
      status: "completed",
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ 2. Récupérer tous les paiements
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "nom prenom email")
      .populate("subscription")
      .populate("order");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 3. Récupérer un paiement par ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user")
      .populate("subscription")
      .populate("order");
    if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 4. Vérifier le statut d'un paiement
exports.checkPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
    });
    if (!payment)
      return res.status(404).json({ error: "Transaction non trouvée" });
    res.json({ status: payment.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
