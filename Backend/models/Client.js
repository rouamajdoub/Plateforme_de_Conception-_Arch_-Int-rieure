const mongoose = require("mongoose");
const User = require("./User");

const clientSchema = new mongoose.Schema(
  {
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



module.exports = User.discriminator("client", clientSchema);
