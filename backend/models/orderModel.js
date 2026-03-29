const { supabaseAdmin } = require('../config/supabase');
const ProductModel = require('./productModel');

const crypto = require('crypto');

const OrderModel = {
    // Generate unique, hard-to-guess order number
    _generateOrderNumber() {
        const prefix = 'FC';
        const random = crypto.randomBytes(6).toString('hex').toUpperCase();
        // Format: FC-A3F2-9BC1-E7D4 (12 hex chars in 3 groups)
        return `${prefix}-${random.slice(0, 4)}-${random.slice(4, 8)}-${random.slice(8, 12)}`;
    },

    // Create a new order with items
    async create(orderData, items) {
        const orderNumber = this._generateOrderNumber();

        // Insert order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number: orderNumber,
                user_id: orderData.user_id || null,
                guest_name: orderData.guest_name || null,
                guest_email: orderData.guest_email || null,
                total: orderData.total,
                shipping_address: orderData.shipping_address,
                city: orderData.city,
                phone: orderData.phone,
                payment_method: 'COD',
                notes: orderData.notes || null
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Insert order items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // Decrement stock
        for (const item of items) {
            try {
                const { data: prod } = await supabaseAdmin
                    .from('products')
                    .select('stock')
                    .eq('id', item.product_id)
                    .single();
                if (prod) {
                    await ProductModel.updateStock(item.product_id, prod.stock - item.quantity);
                }
            } catch (stockErr) {
                console.error(`Failed to decrement stock for product ${item.product_id}:`, stockErr.message);
            }
        }

        return { ...order, items: orderItems };
    },

    // Get all orders (admin) with pagination
    async getAll({ status, limit = 20, offset = 0 }) {
        let query = supabaseAdmin
            .from('orders')
            .select('*, order_items(*)', { count: 'exact' });

        if (status) query = query.eq('status', status);

        query = query.order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) throw error;
        return { orders: data, total: count };
    },

    // Get order by ID
    async getById(id) {
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    // Get order by order number
    async getByOrderNumber(orderNumber) {
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*, order_items(*)')
            .eq('order_number', orderNumber)
            .single();
        if (error) throw error;
        return data;
    },

    // Get orders by user ID
    async getByUserId(userId) {
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*, order_items(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    // Update order status (admin)
    async updateStatus(id, status) {
        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // Get order stats (admin dashboard)
    async getStats() {
        const { data: allOrders, error } = await supabaseAdmin
            .from('orders')
            .select('status, total, created_at');

        if (error) throw error;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

        // Today's earnings (non-cancelled orders)
        const todayOrders = allOrders.filter(o => o.created_at >= startOfToday && o.status !== 'cancelled');
        const todayEarnings = todayOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

        // Monthly breakdown for current year (last 12 months)
        const monthlyRevenue = [];
        for (let i = 0; i < 12; i++) {
            const monthStart = new Date(now.getFullYear(), i, 1);
            const monthEnd = new Date(now.getFullYear(), i + 1, 1);
            const monthOrders = allOrders.filter(o => {
                const d = new Date(o.created_at);
                return d >= monthStart && d < monthEnd && o.status !== 'cancelled';
            });
            monthlyRevenue.push({
                month: monthStart.toLocaleString('en-US', { month: 'short' }),
                revenue: monthOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
                orders: monthOrders.length
            });
        }

        const stats = {
            totalOrders: allOrders.length,
            totalRevenue: allOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
            todayEarnings,
            todayOrders: todayOrders.length,
            monthlyRevenue,
            pending: allOrders.filter(o => o.status === 'pending').length,
            confirmed: allOrders.filter(o => o.status === 'confirmed').length,
            processing: allOrders.filter(o => o.status === 'processing').length,
            shipped: allOrders.filter(o => o.status === 'shipped').length,
            delivered: allOrders.filter(o => o.status === 'delivered').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length
        };

        return stats;
    },

    // Delete order (admin) - also deletes associated order items
    async delete(id) {
        // Delete order items first
        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .delete()
            .eq('order_id', id);

        if (itemsError) throw itemsError;

        // Delete order
        const { data, error } = await supabaseAdmin
            .from('orders')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

module.exports = OrderModel;
