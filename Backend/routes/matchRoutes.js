const express = require("express");
const router = express.Router();
const axios = require("axios");
const NeedSheet = require("../models/NeedSheet");
const Architect = require("../models/Architect");

router.post("/match", async (req, res) => {
  try {
    const { needsheetId } = req.body;

    if (!needsheetId) {
      return res.status(400).json({ error: "needsheetId is required" });
    }

    const needsheet = await NeedSheet.findById(needsheetId);
    const architects = await Architect.find();

    if (!needsheet || architects.length === 0) {
      return res.status(404).json({ error: "Missing data" });
    }

    const prompt = `
You are an assistant that matches architects to client needs. 
Here is the client needsheet:\n${JSON.stringify(needsheet, null, 2)}\n
Here are the available architects:\n${JSON.stringify(architects, null, 2)}\n
Based on the client's project type, location, surface, and service type, suggest the best architect(s) and explain your reasoning.
Return only the ID(s) of the best matching architect(s) and a summary.
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: prompt,
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 180000, // 60 seconds max
      }
    );

    const aiResult = response.data.response;
    res.json({ match: aiResult });
  } catch (error) {
    console.error("Matching error:", error.message);
    res.status(500).json({ error: "AI matching failed. Please try again." });
  }
});

module.exports = router;
