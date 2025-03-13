const express = require("express");
const router = express.Router();
const { getAllReviews } = require("../controllers/reviewController");

// Route pour récupérer tous les avis
router.get("/", getAllReviews);

module.exports = router;
