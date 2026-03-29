const CategoryModel = require('../models/categoryModel');

const categoryController = {
    // GET /api/categories
    async getAll(req, res, next) {
        try {
            const categories = await CategoryModel.getAll();
            res.json(categories);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/categories/:slug
    async getBySlug(req, res, next) {
        try {
            const category = await CategoryModel.getBySlug(req.params.slug);
            if (!category) {
                res.status(404);
                throw new Error('Category not found');
            }
            res.json(category);
        } catch (error) {
            next(error);
        }
    },

    // POST /api/categories (admin)
    async create(req, res, next) {
        try {
            const { name, description, image_url, display_order } = req.body;
            if (!name) {
                res.status(400);
                throw new Error('Category name is required');
            }
            const category = await CategoryModel.create({ name, description, image_url, display_order });
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/categories/:id (admin)
    async update(req, res, next) {
        try {
            const category = await CategoryModel.update(req.params.id, req.body);
            if (!category) {
                res.status(404);
                throw new Error('Category not found');
            }
            res.json(category);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/categories/:id (admin)
    async delete(req, res, next) {
        try {
            await CategoryModel.delete(req.params.id);
            res.json({ message: 'Category deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = categoryController;
