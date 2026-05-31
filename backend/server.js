require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Logging Middleware
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local images in dev if needed
}));
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity, can be locked down in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if any
app.use('/uploads', express.static('uploads'));

// DB Connection
let isDbConnected = false;
connectDB().then(connected => {
  isDbConnected = connected;
  app.set('dbConnected', connected);
});

// Root API Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    database: isDbConnected ? 'MongoDB Mongoose' : 'Local Data Emulator (Active)',
    brand: 'DIN'
  });
});

// Bind Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[DIN Backend] Premium Server running on port ${PORT}`);
  console.log(`[DIN Backend] Health check: http://localhost:${PORT}/api/health`);
});
