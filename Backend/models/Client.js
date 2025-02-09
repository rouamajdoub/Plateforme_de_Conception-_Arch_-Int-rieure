const mongoose = require("mongoose");
const User = require("./User");
const { hashPassword } = require("../utils/hashUtils");

const clientSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true, trim: true },
    nomDeFamille: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    location: {
      country: { type: String, required: true },
      region: { type: String, required: true },
      city: { type: String },
    },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

module.exports = mongoose.model("Client", clientSchema);
