const Architect = require("../models/Architect");

// ✅ Get all architects
exports.getArchitects = async (req, res) => {
  try {
    const architects = await Architect.find();
    res.json(architects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a new architect
exports.createArchitect = async (req, res) => {
  try {
    const newArchitect = new Architect(req.body);
    await newArchitect.save();
    res.status(201).json(newArchitect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get a specific architect by ID
exports.getArchitectById = async (req, res) => {
  try {
    const architect = await Architect.findById(req.params.id);
    if (!architect)
      return res.status(404).json({ message: "Architect not found" });
    res.json(architect);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update an architect
exports.updateArchitect = async (req, res) => {
  try {
    const updatedArchitect = await Architect.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedArchitect)
      return res.status(404).json({ message: "Architect not found" });
    res.json(updatedArchitect);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete an architect
exports.deleteArchitect = async (req, res) => {
  try {
    const deletedArchitect = await Architect.findByIdAndDelete(req.params.id);
    if (!deletedArchitect)
      return res.status(404).json({ message: "Architect not found" });
    res.json({ message: "Architect deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
