const mongoose = require("mongoose");
const validator = require("validator");
const { hashPassword } = require("../utils/hashUtils");

const architectSchema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true, trim: true, minlength: 3 },
    nomDeFamille: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
      lowercase: true,
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
    experienceYears: { type: Number, required: true, min: 0 },
    specialization: {
      type: [String],
      required: true,
      enum: ["Residential", "Commercial", "Interior Design", "Urban Planning", "3D Modeling"],
    },
    portfolioURL: { type: String, validate: [validator.isURL, "Invalid URL"] },
    certifications: { type: [String], enum: ["LEED", "ISO 9001", "RIBA", "NCARB"] },
    education: {
      degree: { type: String, enum: ["Bachelor", "Master", "PhD"] },
      institution: String,
      graduationYear: Number,
    },
    softwareProficiency: [
      {
        name: String,
        level: { type: String, enum: ["Beginner", "Intermediate", "Expert"] },
      },
    ],
    location: {
      country: { type: String, required: true },
      region: { type: String, required: true },
      city: { type: String },
      coordinates: { type: { type: String, default: "Point" }, coordinates: [Number] },
    },
    website: { type: String, validate: [validator.isURL, "Invalid URL"] },
    socialMedia: {
      linkedin: String,
      instagram: String,
    },
    subscription: {
      type: { type: String, enum: ["Gratuit", "Premium", "VIP"], default: "Gratuit" },
      startDate: { type: Date },
      endDate: {
        type: Date,
        validate: {
          validator: function (v) {
            return this.subscription.startDate <= v;
          },
          message: "End date must be after start date",
        },
      },
      isActive: { type: Boolean, default: false },
    },
    rating: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, maxlength: 500 },
        rating: { type: Number, min: 0, max: 5, required: true },
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
