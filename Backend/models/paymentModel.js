const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // L'utilisateur qui paie (architecte ou client)

    amount: {
      type: Number,
      required: true,
    }, // Montant payé

    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "bank_transfer"],
      required: true,
    }, // Moyen de paiement

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    }, // État du paiement

    type: {
      type: String,
      enum: ["subscription", "product"],
      required: true,
    }, // Paiement pour abonnement ou achat produit

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: function () {
        return this.type === "subscription";
      },
    }, // ID de l'abonnement (si applicable)

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: function () {
        return this.type === "product";
      },
    }, // ID de la commande (si applicable)

    transactionId: {
      type: String,
      required: true,
      unique: true,
    }, // ID de transaction unique

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
