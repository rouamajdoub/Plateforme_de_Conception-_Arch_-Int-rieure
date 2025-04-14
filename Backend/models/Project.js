const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArchitectClient",
      required: true,
    },
    //for the architect dash

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
    budget: { type: Number, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    actualEndDate: { type: Date }, // Actual completion date that may differ from planned
    //clinet dash
    isPublic: { type: Boolean, default: false },
    showroomStatus: {
      type: String,
      enum: ["featured", "trending", "normal"],
      default: "normal",
    },

    //media
    coverImage: { type: String, required: true },
    beforePhotos: [{ type: String }],
    afterPhotos: [{ type: String }],
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
    // for search
    tags: [{ type: String }],

    //for the interactions
    needsSheet: { type: mongoose.Schema.Types.ObjectId, ref: "NeedsSheet" },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quote" }],
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    rating: { type: Number, default: 0 },

    //for the project progress
    progressPercentage: { type: Number, default: 0 },
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
    //payments
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partially_paid"],
      default: "pending",
    },
    paymentHistory: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        method: { type: String },
        reference: { type: String },
        notes: { type: String },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field for architect name
projectSchema.virtual("architectName", {
  ref: "User",
  localField: "architectId",
  foreignField: "_id",
  justOne: true,
});
// Validation for end date to be after start date
projectSchema.pre("validate", function (next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    this.invalidate("endDate", "End date must be after start date");
  }
  next();
});
// Exporting the model
module.exports = mongoose.model("Project", projectSchema);
