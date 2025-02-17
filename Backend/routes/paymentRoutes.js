const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// 🔹 Créer un paiement (abonnement ou produit)
router.post("/", paymentController.createPayment);

// 🔹 Récupérer tous les paiements
router.get("/", paymentController.getAllPayments);

// 🔹 Récupérer un paiement par ID
router.get("/:id", paymentController.getPaymentById);

// 🔹 Vérifier le statut d'un paiement via transactionId
router.get("/status/:transactionId", paymentController.checkPaymentStatus);

module.exports = router;
