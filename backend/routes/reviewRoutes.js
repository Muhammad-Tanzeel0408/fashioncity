const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Multer config for review images
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const mimetype = allowed.test(file.mimetype);
        const extname = allowed.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Only image files are allowed'));
    }
});

// Public routes
router.get('/:productId', reviewController.getByProduct);
router.post('/', upload.single('image'), reviewController.create);

// Admin routes
router.delete('/:id', adminMiddleware, reviewController.delete);

module.exports = router;
