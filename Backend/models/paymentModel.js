const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // L'utilisateur qui a effectué le paiement
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // La commande associée au paiement
    amount: { type: Number, required: true }, // Montant total du paiement
    paymentMethod: { type: String, enum: ["credit_card", "paypal", "bank_transfer"], required: true }, // Méthode de paiement
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, // Statut du paiement
    transactionId: { type: String, unique: true, required: true }, // ID unique de transaction (fourni par le service de paiement)
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);

module.exports = mongoose.model("Payment", paymentSchema);
