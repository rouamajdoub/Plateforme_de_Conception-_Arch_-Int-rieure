const mongoose = require("mongoose");
const { hashPassword } = require("../utils/hashUtils");

const adminSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin"],
      default: "Admin",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

module.exports = mongoose.model("Admin", adminSchema);
