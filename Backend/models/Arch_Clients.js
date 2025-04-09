const mongoose = require("mongoose");

const architectClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      region: String,
      country: String,
      postalCode: String,
    },
    notes: {
      type: String,
    },
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArchitectClient", architectClientSchema);
