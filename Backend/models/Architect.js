const mongoose = require("mongoose");
const User = require("./User"); // Import the base User schema

const architectSchema = new mongoose.Schema(
  {
    experienceYears: { type: Number, required: true },
    specialization: { type: [String], required: true },
    portfolioURL: { type: String },
    certifications: { type: [String] },
    education: { type: String },

    // Subscription Info
    subscriptionType: {
      type: String,
      enum: ["Gratuit", "Premium", "VIP"],
      default: "Gratuit",
    },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },

    // Ratings & Reviews
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: [
      {
        client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: String,
        rating: { type: Number, min: 0, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

// Create Architect model as a discriminator of User
const Architect = User.discriminator("architect", architectSchema);
module.exports = Architect;
