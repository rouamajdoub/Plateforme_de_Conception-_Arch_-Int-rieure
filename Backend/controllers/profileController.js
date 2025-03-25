const Architect = require("../models/Architect");

// Get the authenticated architect's profile
exports.getMyProfile = async (req, res) => {
  try {
    const architect = await Architect.findById(req.user.id).populate(
      "subscription"
    );
    if (!architect)
      return res.status(404).json({ error: "Architect not found" });

    res.json(architect);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update the authenticated architect's profile
exports.updateMyProfile = async (req, res) => {
  try {
    const updatedArchitect = await Architect.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedArchitect)
      return res.status(404).json({ error: "Architect not found" });

    res.json(updatedArchitect);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Delete the authenticated architect's profile
exports.deleteMyProfile = async (req, res) => {
  try {
    const deletedArchitect = await Architect.findByIdAndDelete(req.user.id);
    if (!deletedArchitect)
      return res.status(404).json({ error: "Architect not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};

// Get architect stats (profile views, ratings, review count)
exports.getMyStats = async (req, res) => {
  try {
    const architect = await Architect.findById(req.user.id);
    if (!architect)
      return res.status(404).json({ error: "Architect not found" });

    res.json({
      profileViews: architect.profileViews || 0,
      totalReviews: architect.reviews?.length || 0,
      averageRating: architect.rating?.average || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Change payment status (for subscription)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!["pending", "completed"].includes(paymentStatus)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const architect = await Architect.findById(req.user.id);
    if (!architect)
      return res.status(404).json({ error: "Architect not found" });

    if (!architect.subscription) {
      return res.status(400).json({ error: "No active subscription found" });
    }

    architect.paymentStatus = paymentStatus;
    await architect.save();

    res.json({ message: "Payment status updated", architect });
  } catch (error) {
    res.status(500).json({ error: "Failed to update payment status" });
  }
};
