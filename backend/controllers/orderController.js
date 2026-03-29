const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');

const orderController = {
    // POST /api/orders — Create order (COD only)
    async create(req, res, next) {
        try {
            const { items, shipping_address, city, phone, guest_name, guest_email, notes, delivery_charges } = req.body;

            if (!items || !items.length) {
                res.status(400);
                throw new Error('Order must contain at least one item');
            }
            if (!shipping_address || !city || !phone) {
                res.status(400);
                throw new Error('Shipping address, city, and phone are required');
            }

            // Calculate total and add delivery charges
            const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = itemsTotal + (delivery_charges || 0);

            // Check stock availability
            for (const item of items) {
                const product = await ProductModel.getById(item.product_id);
                if (!product) {
                    throw new Error(`Product ${item.product_name} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
                }
            }

            const orderData = {
                user_id: req.user ? req.user.id : null,
                guest_name: req.user ? null : guest_name,
                guest_email: req.user ? null : guest_email,
                total,
                shipping_address,
                city,
                phone,
                notes
            };

            const order = await OrderModel.create(orderData, items);

            res.status(201).json({
                message: 'Order placed successfully! Payment: Cash on Delivery',
                order
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/orders/my — Get logged-in user's orders
    async getMyOrders(req, res, next) {
        try {
            const orders = await OrderModel.getByUserId(req.user.id);
            res.json(orders);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/orders/track/:orderNumber — Track order by number
    async trackOrder(req, res, next) {
        try {
            const order = await OrderModel.getByOrderNumber(req.params.orderNumber);
            if (!order) {
                res.status(404);
                throw new Error('Order not found');
            }
            // Return limited info for tracking
            res.json({
                order_number: order.order_number,
                status: order.status,
                total: order.total,
                items_count: order.order_items?.length || 0,
                created_at: order.created_at,
                payment_method: order.payment_method
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/orders (admin) — Get all orders
    async getAll(req, res, next) {
        try {
            const { status, limit, offset } = req.query;
            const result = await OrderModel.getAll({
                status,
                limit: parseInt(limit) || 20,
                offset: parseInt(offset) || 0
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // GET /api/orders/:id (admin) — Get order details
    async getById(req, res, next) {
        try {
            const order = await OrderModel.getById(req.params.id);
            if (!order) {
                res.status(404);
                throw new Error('Order not found');
            }
            res.json(order);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/orders/:id/status (admin) — Update order status
    async updateStatus(req, res, next) {
        try {
            const { status } = req.body;
            const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

            if (!validStatuses.includes(status)) {
                res.status(400);
                throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
            }

            // Get current order status
            const currentOrder = await OrderModel.getById(req.params.id);
            if (!currentOrder) {
                res.status(404);
                throw new Error('Order not found');
            }

            // If cancelling, restore stock
            if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
                for (const item of currentOrder.order_items) {
                    try {
                        const product = await ProductModel.getById(item.product_id);
                        if (product) {
                            await ProductModel.updateStock(item.product_id, product.stock + item.quantity);
                        }
                    } catch (stockErr) {
                        console.error(`Failed to restore stock for product ${item.product_id}:`, stockErr.message);
                    }
                }
            }

            const order = await OrderModel.updateStatus(req.params.id, status);
            res.json({ message: `Order status updated to ${status}`, order });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/orders/stats (admin)
    async getStats(req, res, next) {
        try {
            const stats = await OrderModel.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    },

    // DELETE /api/orders/:id (admin) — Delete order
    async delete(req, res, next) {
        try {
            const order = await OrderModel.getById(req.params.id);
            if (!order) {
                res.status(404);
                throw new Error('Order not found');
            }

            await OrderModel.delete(req.params.id);
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = orderController;
