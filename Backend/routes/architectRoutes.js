const express = require("express");
const router = express.Router();
const architectController = require("../controllers/architectController");

// Get all architect requests
router.get("/requests", architectController.getArchitectRequests);

// Update architect status
router.patch("/requests/:id", architectController.updateArchitectStatus);

module.exports = router;
