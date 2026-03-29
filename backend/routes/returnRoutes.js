const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public
router.post('/', returnController.create);

// Admin
router.get('/', adminMiddleware, returnController.getAll);
router.put('/:id/status', adminMiddleware, returnController.updateStatus);
router.delete('/:id', adminMiddleware, returnController.delete);

module.exports = router;
