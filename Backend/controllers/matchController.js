const Match = require("../models/Match");

exports.createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMatchStatus = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
