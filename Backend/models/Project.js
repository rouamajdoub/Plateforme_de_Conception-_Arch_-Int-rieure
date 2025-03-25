const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    architectId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true }, // ✅ Quick summary for showroom
    description: { type: String, required: true },
    category: { type: String, required: true }, // ✅ Type of project (e.g., "Interior Design")

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "canceled"],
      default: "pending",
    },

    budget: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },

    // 🔹 Showroom Visibility
    isPublic: { type: Boolean, default: false }, // ✅ Controls if project is in showroom
    showroomStatus: {
      type: String,
      enum: ["featured", "trending", "normal"],
      default: "normal",
    }, // ✅ Public status

    // 🔹 Media & Presentation
    coverImage: { type: String, required: true }, // ✅ Main image for showroom
    images: [{ type: String }], // Additional images for project gallery
    videos: [{ type: String }], // ✅ Video URLs (optional)

    // 🔹 Engagement & Analytics
    views: { type: Number, default: 0 }, // ✅ Number of times project is viewed
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [], // Explicitly set default to an empty array
    },
    shares: { type: Number, default: 0 }, // ✅ Number of times shared
    tags: [{ type: String }], // ✅ Keywords for search (e.g., "modern, luxury, apartment")

    // 🔹 Needs Sheet & Matching
    needsSheet: { type: mongoose.Schema.Types.ObjectId, ref: "NeedsSheet" },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],

    // 🔹 Quotes & Invoices
    quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quote" }],
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],

    // 🔹 Reviews & Ratings
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    rating: { type: Number, default: 0 }, // ✅ Average rating from reviews

    // 🔹 Milestones & Progress Tracking
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
    progressPercentage: { type: Number, default: 0 },

    // 🔹 Communication
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

    // 🔹 Payment & Security
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partially_paid"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Project", projectSchema);
