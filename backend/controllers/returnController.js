const ReturnModel = require('../models/returnModel');

const returnController = {
    // GET /api/returns (admin) — Get all returns
    async getAll(req, res, next) {
        try {
            const returns = await ReturnModel.getAll();
            res.json(returns);
        } catch (error) {
            next(error);
        }
    },

    // POST /api/returns — Create a return request (public)
    async create(req, res, next) {
        try {
            const { order_id, product_id, customer_name, customer_email, customer_phone, product_name, quantity, size, color, reason, description } = req.body;

            if (!order_id || !customer_name || !customer_phone || !product_name || !reason) {
                res.status(400);
                throw new Error('Order ID, customer name, phone, product name, and reason are required');
            }

            const returnRequest = await ReturnModel.create({
                order_id,
                product_id: product_id || null,
                customer_name,
                customer_email: customer_email || null,
                customer_phone,
                product_name,
                quantity: quantity || 1,
                size: size || null,
                color: color || null,
                reason,
                description: description || null,
                status: 'pending'
            });

            res.status(201).json(returnRequest);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/returns/:id/status (admin) — Update return status
    async updateStatus(req, res, next) {
        try {
            const { status } = req.body;
            const validStatuses = ['pending', 'approved', 'rejected', 'picked_up', 'refunded'];
            if (!validStatuses.includes(status)) {
                res.status(400);
                throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
            }
            const updated = await ReturnModel.updateStatus(req.params.id, status);
            res.json(updated);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/returns/:id (admin) — Delete a return
    async delete(req, res, next) {
        try {
            await ReturnModel.delete(req.params.id);
            res.json({ message: 'Return request deleted' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = returnController;
