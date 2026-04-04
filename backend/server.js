const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const returnRoutes = require('./routes/returnRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// --------------- Middleware ---------------
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- Routes ---------------
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to FashionCity API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      users: '/api/users',
      admin: '/api/admin',
      upload: '/api/upload'
    }
  });
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/returns', returnRoutes);

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;
let server;
let listenAttempts = 0;
const MAX_LISTEN_RETRIES = 6;
const LISTEN_RETRY_DELAY_MS = 500;

const startServer = () => {
  server = app.listen(PORT, () => {
    listenAttempts = 0;
    console.log(`\n🚀 FashionCity API Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API Base: http://localhost:${PORT}/api\n`);
  });

  // If nodemon restarts quickly, Windows can keep the port in TIME_WAIT.
  // Retry briefly instead of crashing immediately.
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && listenAttempts < MAX_LISTEN_RETRIES) {
      listenAttempts += 1;
      console.warn(
        `⚠️  Port ${PORT} is busy (EADDRINUSE). Retrying in ${LISTEN_RETRY_DELAY_MS}ms... (${listenAttempts}/${MAX_LISTEN_RETRIES})`
      );
      setTimeout(startServer, LISTEN_RETRY_DELAY_MS);
      return;
    }

    console.error('❌ Server failed to start:', err);
    process.exit(1);
  });
};

startServer();

// Graceful shutdown — release port on restart/kill
const shutdown = (signal) => {
  if (!server) process.exit(0);

  server.close(() => {
    if (signal === 'SIGUSR2') {
      // Allow nodemon to restart after we close the server.
      process.kill(process.pid, 'SIGUSR2');
      return;
    }
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 3000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGUSR2', () => shutdown('SIGUSR2'));

module.exports = app;
