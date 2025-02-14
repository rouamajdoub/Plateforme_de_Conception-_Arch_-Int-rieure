const Quote = require("../models/Quote");

exports.createQuote = async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();
    res.status(201).json(quote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getQuotesByProject = async (req, res) => {
  try {
    const quotes = await Quote.find({
      projectId: req.params.projectId,
    }).populate("architectId");
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
