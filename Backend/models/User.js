const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true, trim: true },
    nomDeFamille: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8, select: false },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ["admin", "architect", "client"],
      default: "client",
      required: true,
    },
    pays: { type: String },
    region: { type: String },
    isVerified: { type: Boolean, default: false },

    // Terms & Conditions
    contentTerm: { type: Boolean, default: false },
    cgvAndCguTerm: { type: Boolean, default: false },
    infoTerm: { type: Boolean, default: false },
    majorTerm: { type: Boolean, default: false },
    exterieurParticipantTerm: { type: Boolean, default: false },
    authTokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true, discriminatorKey: "role" }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash password
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Auth Token Method
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  this.authTokens.push({ token });
  await this.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
