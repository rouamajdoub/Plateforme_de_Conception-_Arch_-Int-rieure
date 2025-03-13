const mongoose = require("mongoose");
const User = require("./User");

const architectSchema = new mongoose.Schema(
  {
    companyName: { type: String },
    experienceYears: { type: Number },
    specialization: { type: [String] },
    portfolioURL: { type: String },
    certifications: { type: [String] },
    patenteNumber: { type: String, required: true },
    cin: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
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
      country: { type: String },
      region: { type: String },
      city: { type: String },
      coordinates: {
        type: { type: String, enum: ["Point"] },
        coordinates: {
          type: [Number],
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
        },
        comment: { type: String },
        rating: { type: Number },
        date: { type: Date, default: Date.now },
      },
    ],
    termsAccepted: {
      content: { type: Boolean, default: false },
      cgvCgu: { type: Boolean, default: false },
      privacy: { type: Boolean, default: false },
      lastUpdated: Date,
    },
    emailVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    documents: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

architectSchema.index({ "location.coordinates": "2dsphere" });

module.exports = User.discriminator("architect", architectSchema);
