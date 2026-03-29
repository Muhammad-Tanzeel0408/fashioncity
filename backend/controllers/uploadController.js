const { supabaseAdmin } = require('../config/supabase');
const fs = require('fs');
const path = require('path');

const uploadController = {
    // POST /api/upload
    async uploadFile(req, res, next) {
        try {
            if (!req.file) {
                res.status(400);
                throw new Error('No file uploaded');
            }

            const file = req.file;
            const fileExt = path.extname(file.originalname);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
            const filePath = `uploads/${fileName}`;

            // Read file buffer
            // Note: Multer with memoryStorage would give us buffer directly.
            // If diskStorage is used, we need to read from path.
            // Let's assume standard diskStorage for now or check multer config. 
            // Better to use buffer if possible for Supabase. 
            // If req.file.buffer exists, use it. If not, read from path.

            let fileBody;
            if (file.buffer) {
                fileBody = file.buffer;
            } else {
                fileBody = fs.readFileSync(file.path);
            }

            // Upload to Supabase Storage
            const { data, error } = await supabaseAdmin
                .storage
                .from('products') // Make sure this bucket exists!
                .upload(filePath, fileBody, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) throw error;

            // Get Public URL
            const { data: { publicUrl } } = supabaseAdmin
                .storage
                .from('products')
                .getPublicUrl(filePath);

            // Clean up local file if it was saved to disk
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }

            res.status(201).json({
                message: 'File uploaded successfully',
                url: publicUrl,
                path: filePath
            });

        } catch (error) {
            // Clean up local file if it exists
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            next(error);
        }
    }
};

module.exports = uploadController;
