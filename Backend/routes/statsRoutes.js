const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Dashboard statistics route
router.get('/dashboard/:userId', statsController.getDashboardStats);

// Profile views increment route
router.put('/profile-views/:profileId', statsController.incrementProfileViews);

// Comparison statistics route
router.get('/comparison/:userId', statsController.getComparisonStats);

module.exports = router;