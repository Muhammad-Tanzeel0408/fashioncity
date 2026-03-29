const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public routes
router.get('/hero-slides', settingsController.getHeroSlides);

// Admin routes
router.put('/hero-slides', adminMiddleware, settingsController.updateHeroSlides);

module.exports = router;
