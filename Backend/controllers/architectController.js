const User = require("../models/User");

// Get all architect requests
exports.getArchitectRequests = async (req, res) => {
  try {
    const requests = await User.find({
      role: "architect",
      status: "pending",
    }).select("-password -authTokens");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject a request
exports.updateArchitectStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    // Find and update using the base User model with role filter
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: id,
        role: "architect", // Ensure we're only updating architects
      },
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -authTokens");

    if (!updatedUser) {
      return res.status(404).json({ error: "Architect not found" });
    }

    res.json({
      message: `Architect status updated to ${status}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: "Failed to update architect status",
      details: error.message,
    });
  }
};
