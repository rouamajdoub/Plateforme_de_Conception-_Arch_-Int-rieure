const mongoose = require("mongoose");
const Review = require("./Review"); // Import the base review model

const projectReviewSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Reference to Project model
      required: true,
    },
  },
  { timestamps: true }
);

// Create the discriminator
const ProjectReview = Review.discriminator("ProjectReview", projectReviewSchema);

module.exports = ProjectReview;