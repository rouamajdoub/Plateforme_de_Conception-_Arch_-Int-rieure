const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    //for the architect dash
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientType: {
      type: String,
      enum: ["visionaClient", "architectClient"],
      required: true,
    },

    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "canceled"],
      default: "pending",
    },
    budget: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    isPublic: { type: Boolean, default: false },
    showroomStatus: {
      type: String,
      enum: ["featured", "trending", "normal"],
      default: "normal",
    },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    videos: [{ type: String }],

    //for the stats and interactions
    views: { type: Number, default: 0 },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shares: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0 },
    // for search
    tags: [{ type: String }],

    //for the interactions
    needsSheet: { type: mongoose.Schema.Types.ObjectId, ref: "NeedsSheet" },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quote" }],
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    rating: { type: Number, default: 0 },
    milestones: [
      {
        title: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed"],
          default: "pending",
        },
        dueDate: { type: Date },
      },
    ],
    messages: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    meetings: [
      {
        date: { type: Date },
        time: { type: String },
        link: { type: String },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partially_paid"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for architect name
projectSchema.virtual("architectName", {
  ref: "User", // The model to use
  localField: "architectId", // Find architectId in the project
  foreignField: "_id", // Find the _id in the User model
  justOne: true, // Only need one result
});

// Exporting the model
module.exports = mongoose.model("Project", projectSchema);
