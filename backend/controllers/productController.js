const ProductModel = require('../models/productModel');

const productController = {
    // GET /api/products — Get all products with filters
    async getAll(req, res, next) {
        try {
            const { category, featured, search, limit, offset, sort, order } = req.query;
            const result = await ProductModel.getAll({
                category,
                featured: featured === 'true',
                search,
                limit: parseInt(limit) || 20,
                offset: parseInt(offset) || 0,
                sort,
                order
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/products/featured — Get featured products
    async getFeatured(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 8;
            const products = await ProductModel.getFeatured(limit);
            res.json(products);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/products/search/suggestions — Autocomplete suggestions
    async searchSuggestions(req, res, next) {
        try {
            const { q } = req.query;
            console.log('[Search Suggestions] query:', q);
            if (!q || q.trim().length < 2) {
                return res.json({ products: [], categories: [] });
            }
            const result = await ProductModel.searchSuggestions(q, 6);
            console.log('[Search Suggestions] results:', result.products?.length, 'products,', result.categories?.length, 'categories');
            res.json(result);
        } catch (error) {
            console.error('[Search Suggestions] ERROR:', error);
            next(error);
        }
    },

    // GET /api/products/search/full — Full search across products + categories
    async searchFull(req, res, next) {
        try {
            const { q, limit, offset, sort, order } = req.query;
            if (!q || !q.trim()) {
                return res.json({ products: [], total: 0 });
            }
            const result = await ProductModel.searchFull({
                search: q,
                limit: parseInt(limit) || 20,
                offset: parseInt(offset) || 0,
                sort,
                order
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/products/:slug — Get single product
    async getBySlug(req, res, next) {
        try {
            const product = await ProductModel.getBySlug(req.params.slug);
            if (!product) {
                res.status(404);
                throw new Error('Product not found');
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/products/:slug/recommended — Get recommended products
    async getRecommended(req, res, next) {
        try {
            const product = await ProductModel.getBySlug(req.params.slug);
            if (!product) {
                res.status(404);
                throw new Error('Product not found');
            }
            const limit = parseInt(req.query.limit) || 8;
            const recommended = await ProductModel.getRecommended(
                product.id,
                product.category_ids || (product.category_id ? [product.category_id] : []),
                limit
            );
            res.json(recommended);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/products/id/:id — Get single product by ID (Admin)
    async getById(req, res, next) {
        try {
            const product = await ProductModel.getById(req.params.id);
            if (!product) {
                res.status(404);
                throw new Error('Product not found');
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    },

    // POST /api/products — Create product (admin)
    async create(req, res, next) {
        try {
            const { name, description, price, sale_price, images, category_id, category_ids, sizes, colors, stock, is_featured } = req.body;

            if (!name || !price) {
                res.status(400);
                throw new Error('Name and price are required');
            }

            // Support both category_id (single) and category_ids (array from frontend)
            let resolvedCategoryIds = [];
            if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
                resolvedCategoryIds = category_ids;
            } else if (category_id) {
                resolvedCategoryIds = Array.isArray(category_id) ? category_id : [category_id];
            }

            const product = await ProductModel.create({
                name, description, price,
                sale_price: sale_price || null,
                images: images || [],
                category_ids: resolvedCategoryIds,
                sizes: sizes || [],
                colors: colors || [],
                stock: stock || 0,
                is_featured: is_featured || false
            });

            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/products/:id — Update product (admin)
    async update(req, res, next) {
        try {
            const updateData = { ...req.body };

            // If frontend sends category_ids array, the model will handle setting category_id
            // If only category_id is sent, wrap it in an array
            if (!updateData.category_ids && updateData.category_id) {
                updateData.category_ids = [updateData.category_id];
            }

            const product = await ProductModel.update(req.params.id, updateData);
            if (!product) {
                res.status(404);
                throw new Error('Product not found');
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/products/:id — Soft delete product (admin)
    async delete(req, res, next) {
        try {
            await ProductModel.delete(req.params.id);
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productController;
