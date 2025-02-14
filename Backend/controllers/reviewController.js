const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewsByProject = async (req, res) => {
  try {
    const reviews = await Review.find({
      projectId: req.params.projectId,
    }).populate("reviewerId");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
