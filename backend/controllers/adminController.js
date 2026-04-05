const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');

const adminController = {
    // POST /api/admin/login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400);
                throw new Error('Email and password are required');
            }

            const admin = await AdminModel.findByEmail(email);
            if (!admin) {
                res.status(401);
                throw new Error('Invalid admin credentials');
            }

            const isMatch = await bcrypt.compare(password, admin.password_hash);
            if (!isMatch) {
                res.status(401);
                throw new Error('Invalid admin credentials');
            }

            const token = jwt.sign(
                { id: admin.id, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            const { password_hash, ...adminData } = admin;
            res.json({ admin: adminData, token });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/admin/setup — One-time admin creation (only if no admins exist)
    async setup(req, res, next) {
        try {
            const { name, email, password, setupKey } = req.body;

            // First check: Verify setup key matches environment variable
            if (setupKey !== process.env.ADMIN_SETUP_KEY) {
                res.status(403);
                throw new Error('Invalid setup key. Setup is disabled or key is incorrect.');
            }

            // Security: Check if any admin already exists  
            const { data: existingAdmins, error: countError } = await require('../config/supabase').supabaseAdmin
                .from('admins')
                .select('id', { count: 'exact' });
            
            if (countError) throw countError;
            if (existingAdmins && existingAdmins.length > 0) {
                res.status(403);
                throw new Error('Admin setup has already been completed. Cannot create additional admins this way.');
            }

            const existingAdmin = await AdminModel.findByEmail(email);
            if (existingAdmin) {
                res.status(400);
                throw new Error('Admin with this email already exists');
            }

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const admin = await AdminModel.create({ name, email, password_hash });
            const { password_hash: _, ...adminData } = admin;
            res.status(201).json({ message: 'Admin created successfully', admin: adminData });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/admin/verify — Verify admin token is valid
    async verify(req, res, next) {
        try {
            // adminMiddleware already validated the token and attached req.admin
            const { password_hash, ...adminData } = req.admin;
            res.json({ admin: adminData });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/admin/dashboard — Dashboard stats
    async dashboard(req, res, next) {
        try {
            const OrderModel = require('../models/orderModel');
            const ProductModel = require('../models/productModel');
            const CategoryModel = require('../models/categoryModel');

            const [orderStats, { products, total: totalProducts }, categories] = await Promise.all([
                OrderModel.getStats(),
                ProductModel.getAll({ limit: 1, offset: 0 }),
                CategoryModel.getAll()
            ]);

            res.json({
                orders: orderStats,
                totalProducts,
                totalCategories: categories.length
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = adminController;
