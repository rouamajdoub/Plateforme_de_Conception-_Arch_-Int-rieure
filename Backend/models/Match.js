const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    architectId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clientAccepted: { type: Boolean, default: false },
    architectAccepted: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
