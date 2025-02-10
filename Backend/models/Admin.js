const mongoose = require("mongoose");
const User = require("./User");

const adminSchema = new mongoose.Schema(
  {
    adminPrivileges: { type: [String], default: ["content-moderation"] },
    superAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = User.discriminator("admin", adminSchema);
