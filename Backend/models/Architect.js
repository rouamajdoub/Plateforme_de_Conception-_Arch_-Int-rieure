const mongoose = require("mongoose");
const User = require("./User");
const { hashPassword } = require("../utils/hashUtils");

const architectSchema = new mongoose.Schema(
  {
    nomDeFamille: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
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
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },
    },
    website: { type: String },
    socialMedia: {
      linkedin: String,
      instagram: String,
    },
    subscription: {
      type: { type: String, default: "Gratuit" },
      startDate: { type: Date },
      endDate: { type: Date },
      isActive: { type: Boolean, default: false },
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

// Hash password before saving
architectSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

module.exports = mongoose.model("Architect", architectSchema);
