const express = require('express');
const router = express.Router();
const architectController = require('../controllers/architectController');

// Get all architect requests
router.get('/architects/requests', architectController.getArchitectRequests);

// Update architect status
router.patch('/architects/requests/:id', architectController.updateArchitectStatus);

module.exports = router;