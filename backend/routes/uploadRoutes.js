const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer (Temporary storage)
// accessing 'uploads' directory which might not exist, ensure it does or use memoryStorage
// For Supabase, memoryStorage is often easier as we don't need persistent local files.
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports images and videos!'));
    }
});

// Route: POST /api/upload
// Protected by Admin Middleware to prevent abuse
router.post('/', adminMiddleware, upload.single('file'), uploadController.uploadFile);

module.exports = router;
