const NeedsSheet = require("../models/NeedsSheet");

exports.createNeedsSheet = async (req, res) => {
  try {
    const needsSheet = new NeedsSheet(req.body);
    await needsSheet.save();
    res.status(201).json(needsSheet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllNeedsSheets = async (req, res) => {
  try {
    const sheets = await NeedsSheet.find().populate("clientId projectId");
    res.json(sheets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNeedsSheetById = async (req, res) => {
  try {
    const sheet = await NeedsSheet.findById(req.params.id).populate("clientId projectId");
    if (!sheet) return res.status(404).json({ message: "Needs sheet not found" });
    res.json(sheet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
