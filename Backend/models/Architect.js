const mongoose = require("mongoose");
const User = require("./User");

const architectSchema = new mongoose.Schema(
  {
    //auth
    authMethod: {
      type: String,
      default: "local",
      enum: ["local"],
      required: true,
    },
    firstLogin: { type: Boolean, default: false },

    //business info
    companyName: { type: String },
    experienceYears: { type: Number },
    specialization: { type: [String] },
    portfolioURL: { type: String },
    certifications: { type: [String] },
    patenteNumber: { type: String, required: true },
    cin: { type: String, required: true },

    education: {
      degree: { type: String },
      institution: String,
      graduationYear: Number,
    },

    softwareProficiency: [
      {
        name: { type: String },
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

    //for the stats
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    profileViews: { type: Number, default: 0 },
    profileViewsTimestamps: [{ type: Date }],

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

    // clients
    //i have 2 type of clients Platform-native clients aka "Visionaires" and "ArchitectClient"
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "ArchitectClient" }],
    visionaClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],

    //subs
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    subscriptionType: {
      type: String,
      enum: ["Free", "premium", "vip", "none"],
      default: "none",
    },

    //stripe/payment
    customerId: { type: String },
    priceId: { type: String },
    hasAccess: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    //admin verification
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    documents: [{ type: String }],
    isActive: { type: Boolean, default: true },

    termsAccepted: {
      content: { type: Boolean, default: false },
      cgvCgu: { type: Boolean, default: false },
      privacy: { type: Boolean, default: false },
      lastUpdated: Date,
    },
  },
  { timestamps: true }
);

architectSchema.index({ "location.coordinates": "2dsphere" });

module.exports = User.discriminator("architect", architectSchema);
