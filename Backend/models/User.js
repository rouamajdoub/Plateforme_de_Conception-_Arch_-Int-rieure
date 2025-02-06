const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true },
    nomDeFamille: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ["admin", "architect", "client"],
      default: "client",
    },
    pays: { type: String },
    region: { type: String },
    contentTerm: { type: Boolean, default: false },
    cgvAndCguTerm: { type: Boolean, default: false },
    infoTerm: { type: Boolean, default: false },
    majorTerm: { type: Boolean, default: false },
    exterieurParticipantTerm: { type: Boolean, default: false },
  },
  { timestamps: true, discriminatorKey: "role" } // Enable inheritance
);

const User = mongoose.model("User", userSchema);
module.exports = User;
