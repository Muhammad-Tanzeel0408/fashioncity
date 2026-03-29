const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);

// Admin routes
router.post('/', adminMiddleware, categoryController.create);
router.put('/:id', adminMiddleware, categoryController.update);
router.delete('/:id', adminMiddleware, categoryController.delete);

module.exports = router;
