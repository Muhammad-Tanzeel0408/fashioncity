const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const userController = {
    // POST /api/users/register
    async register(req, res, next) {
        try {
            const { name, email, password, phone, address, city } = req.body;

            if (!name || !email || !password) {
                res.status(400);
                throw new Error('Name, email, and password are required');
            }

            if (password.length < 6) {
                res.status(400);
                throw new Error('Password must be at least 6 characters');
            }

            // Check if user exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                res.status(400);
                throw new Error('User with this email already exists');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Create user
            const user = await UserModel.create({ name, email, password_hash, phone, address, city });

            // Generate JWT
            const token = jwt.sign(
                { id: user.id, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({ user, token });
        } catch (error) {
            next(error);
        }
    },

    // POST /api/users/login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400);
                throw new Error('Email and password are required');
            }

            const user = await UserModel.findByEmail(email);
            if (!user) {
                res.status(401);
                throw new Error('Invalid email or password');
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                res.status(401);
                throw new Error('Invalid email or password');
            }

            const token = jwt.sign(
                { id: user.id, role: 'user' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            // Don't send password_hash back
            const { password_hash, ...userData } = user;
            res.json({ user: userData, token });
        } catch (error) {
            next(error);
        }
    },

    // GET /api/users/profile
    async getProfile(req, res, next) {
        try {
            res.json(req.user);
        } catch (error) {
            next(error);
        }
    },

    // PUT /api/users/profile
    async updateProfile(req, res, next) {
        try {
            const { name, phone, address, city } = req.body;
            const updatedUser = await UserModel.update(req.user.id, { name, phone, address, city });
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = userController;
