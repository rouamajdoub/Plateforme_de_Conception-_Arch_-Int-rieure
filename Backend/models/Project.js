const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    architectId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    budget: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    needsSheet: { type: mongoose.Schema.Types.ObjectId, ref: "NeedsSheet" },
    quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quote" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
