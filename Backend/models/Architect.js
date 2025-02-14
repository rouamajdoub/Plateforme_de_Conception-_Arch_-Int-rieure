const mongoose = require("mongoose");
const User = require("./User");

const architectSchema = new mongoose.Schema(
  {
    experienceYears: { type: Number, required: true },
    specialization: { type: [String], required: true },
    portfolioURL: { type: String },
    certifications: { type: [String] },
    education: {
      degree: { type: String },
      institution: String,
      graduationYear: Number,
    },
    softwareProficiency: [
      {
        name: String,
        level: { type: String },
      },
    ],
    location: {
      country: { type: String, required: true },
      region: { type: String, required: true },
      city: { type: String },
      coordinates: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: {
          type: [Number],
          required: true,
          validate: {
            validator: function (arr) {
              return arr.length === 2; 
            },
            message: "Coordinates must be an array of [longitude, latitude]",
          },
        },
      },
    },

    website: { type: String },
    socialMedia: {
      linkedin: String,
      instagram: String,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription", 
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        client: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: { type: String },
        rating: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    termsAccepted: {
      content: { type: Boolean, default: false },
      cgvCgu: { type: Boolean, default: false },
      privacy: { type: Boolean, default: false },
      lastUpdated: Date,
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

architectSchema.index({ "location.coordinates": "2dsphere" });

module.exports = User.discriminator("architect", architectSchema);
