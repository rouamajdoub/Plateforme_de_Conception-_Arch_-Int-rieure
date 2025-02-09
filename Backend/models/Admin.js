const mongoose = require("mongoose");
const User = require("./User");
const { hashPassword } = require("../utils/hashUtils");

const adminSchema = new mongoose.Schema(
  {
    adminPrivileges: { type: [String], default: ["content-moderation"] },
    superAdmin: { type: Boolean, default: false },
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
