const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');
const returnController = require('../controllers/returnController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// ⚠️  SECURITY: Admin setup endpoint
// This endpoint should ONLY be accessible during initial setup
// After first admin creation, this endpoint will be blocked
// Requires a strong setup key from environment variable: ADMIN_SETUP_KEY
router.post('/setup', adminController.setup);

// Admin login endpoint
router.post('/login', adminController.login);

// ALL ROUTES BELOW THIS LINE REQUIRE ADMIN TOKEN ⚠️
// Verify admin token
router.get('/verify', adminMiddleware, adminController.verify);

// Dashboard (protected)
router.get('/dashboard', adminMiddleware, adminController.dashboard);

// Admin product management (all protected)
router.get('/products/:id', adminMiddleware, productController.getById);
router.get('/products', adminMiddleware, productController.getAll);
router.post('/products', adminMiddleware, productController.create);
router.put('/products/:id', adminMiddleware, productController.update);
router.delete('/products/:id', adminMiddleware, productController.delete);

// Admin category management (all protected)
router.get('/categories', adminMiddleware, categoryController.getAll);
router.post('/categories', adminMiddleware, categoryController.create);
router.put('/categories/:id', adminMiddleware, categoryController.update);
router.delete('/categories/:id', adminMiddleware, categoryController.delete);

// Admin order management (all protected)
router.get('/orders', adminMiddleware, orderController.getAll);
router.get('/orders/stats', adminMiddleware, orderController.getStats);
router.get('/orders/:id', adminMiddleware, orderController.getById);
router.put('/orders/:id/status', adminMiddleware, orderController.updateStatus);
router.delete('/orders/:id', adminMiddleware, orderController.delete);

// Admin review management (all protected)
router.get('/reviews', adminMiddleware, reviewController.getAll);
router.delete('/reviews/:id', adminMiddleware, reviewController.delete);

// Admin return management (all protected)
router.get('/returns', adminMiddleware, returnController.getAll);
router.put('/returns/:id/status', adminMiddleware, returnController.updateStatus);
router.delete('/returns/:id', adminMiddleware, returnController.delete);

module.exports = router;
