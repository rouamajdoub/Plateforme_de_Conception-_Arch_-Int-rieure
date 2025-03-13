const Architect = require("../models/Architect"); // Adjust path as necessary

// Get all architect requests
exports.getArchitectRequests = async (req, res) => {
  try {
    const requests = await Architect.find({ status: "pending" });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve or reject a request
exports.updateArchitectStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (status === "rejected") {
      const deletedArchitect = await Architect.findByIdAndDelete(id);
      if (!deletedArchitect) {
        return res.status(404).json({ message: "Architect not found" });
      }
      return res
        .status(200)
        .json({ message: "Architect deleted successfully" });
    }

    // Otherwise, just update the status
    const updatedArchitect = await Architect.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedArchitect) {
      return res.status(404).json({ message: "Architect not found" });
    }

    res.status(200).json(updatedArchitect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
