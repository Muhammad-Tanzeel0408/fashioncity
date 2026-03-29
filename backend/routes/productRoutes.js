const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/search/suggestions', productController.searchSuggestions);
router.get('/search/full', productController.searchFull);
router.get('/:slug/recommended', productController.getRecommended);
router.get('/:slug', productController.getBySlug);

// Admin routes
router.post('/', adminMiddleware, productController.create);
router.put('/:id', adminMiddleware, productController.update);
router.delete('/:id', adminMiddleware, productController.delete);

module.exports = router;
