const mongoose = require("mongoose");
const validator = require("validator");
const { hashPassword } = require("../utils/hashUtils");

const clientSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true, trim: true, minlength: 3 },
    nomDeFamille: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: { type: String, required: true, minlength: 8 },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isMobilePhone(v, "any"),
        message: "Invalid phone number",
      },
    },
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
