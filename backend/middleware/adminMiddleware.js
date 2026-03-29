const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');

// Verify JWT token for admin
const adminMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Admin access denied. No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }

        const admin = await AdminModel.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ error: 'Invalid token. Admin not found.' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid admin token.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Admin token expired.' });
        }
        next(error);
    }
};

module.exports = { adminMiddleware };
