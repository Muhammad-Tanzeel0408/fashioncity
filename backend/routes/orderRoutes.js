const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Customer routes
router.post('/', optionalAuth, orderController.create);              // Place order (guest or logged in)
router.get('/my', authMiddleware, orderController.getMyOrders);       // My orders (logged in)
router.get('/track/:orderNumber', orderController.trackOrder);        // Track order (public)

// Admin routes
router.get('/', adminMiddleware, orderController.getAll);             // All orders
router.get('/stats', adminMiddleware, orderController.getStats);      // Order stats
router.get('/:id', adminMiddleware, orderController.getById);         // Order details
router.put('/:id/status', adminMiddleware, orderController.updateStatus); // Update status
router.delete('/:id', adminMiddleware, orderController.delete);       // Delete order

module.exports = router;
