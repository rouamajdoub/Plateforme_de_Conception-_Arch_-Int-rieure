const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    architectId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teamName: { type: String, required: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["Team Leader", "Designer", "Contractor"] },
      },
    ],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
