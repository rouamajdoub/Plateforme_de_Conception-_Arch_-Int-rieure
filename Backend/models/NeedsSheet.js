const mongoose = require("mongoose");

const needsSheetSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    details: { type: String, required: true }, // Contient les besoins du client
    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model("NeedsSheet", needsSheetSchema);
