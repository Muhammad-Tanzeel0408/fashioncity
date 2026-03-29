const ReviewModel = require('../models/reviewModel');
const { supabaseAdmin } = require('../config/supabase');
const path = require('path');

const reviewController = {
    // GET /api/reviews (admin) — Get all reviews
    async getAll(req, res, next) {
        try {
            const reviews = await ReviewModel.getAll();
            res.json(reviews);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/reviews/:productId — Get reviews for a product
    async getByProduct(req, res, next) {
        try {
            const { productId } = req.params;
            const [reviews, stats] = await Promise.all([
                ReviewModel.getByProductId(productId),
                ReviewModel.getStats(productId)
            ]);
            res.json({ reviews, ...stats });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/reviews — Submit a review (with optional image)
    async create(req, res, next) {
        try {
            const { product_id, reviewer_name, rating, comment } = req.body;

            if (!product_id || !reviewer_name || !rating) {
                res.status(400);
                throw new Error('Product ID, reviewer name, and rating are required');
            }

            if (rating < 1 || rating > 5) {
                res.status(400);
                throw new Error('Rating must be between 1 and 5');
            }

            let image_url = null;

            // Handle image upload if present
            if (req.file) {
                const file = req.file;
                const fileExt = path.extname(file.originalname);
                const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
                const filePath = `reviews/${fileName}`;

                const { data: uploadData, error: uploadError } = await supabaseAdmin
                    .storage
                    .from('review_images')
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabaseAdmin
                    .storage
                    .from('review_images')
                    .getPublicUrl(filePath);

                image_url = publicUrl;
            }

            const review = await ReviewModel.create({
                product_id,
                reviewer_name: reviewer_name.trim(),
                rating: parseInt(rating),
                comment: comment?.trim() || '',
                image_url
            });

            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/reviews/:id — Delete a review (admin)
    async delete(req, res, next) {
        try {
            await ReviewModel.delete(req.params.id);
            res.json({ message: 'Review deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = reviewController;
