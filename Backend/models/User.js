const mongoose = require("mongoose");
const { hashPassword } = require("../utils/hashUtils");

const userSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true, trim: true },
    nomDeFamille: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ["admin", "architect", "client"],
      default: "client",
      required: true,
    },
    pays: { type: String },
    region: { type: String },

    // Terms & Conditions
    contentTerm: { type: Boolean, default: false },
    cgvAndCguTerm: { type: Boolean, default: false },
    infoTerm: { type: Boolean, default: false },
    majorTerm: { type: Boolean, default: false },
    exterieurParticipantTerm: { type: Boolean, default: false },
  },
  { timestamps: true, discriminatorKey: "role" } // Enable inheritance
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
