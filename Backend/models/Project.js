const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 2000 },
    budget: { type: Number, required: true, min: 0 },
    location: {
      country: { type: String, required: true },
      region: { type: String, required: true },
      city: { type: String },
      coordinates: {
        type: { type: String, default: "Point" },
        coordinates: [Number], // [longitude, latitude]
      },
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    }, // Owner of the project
    architectsInterested: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Architect" },
    ], // Architects who showed interest
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

projectSchema.index({ "location.coordinates": "2dsphere" }); // Geospatial indexing

module.exports = mongoose.model("Project", projectSchema);
