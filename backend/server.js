require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression Middleware
app.use(compression());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FitZone Super Admin API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FitZone Super Admin API v1.0',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/superadmin/auth',
      users: '/api/superadmin/users',
      branches: '/api/superadmin/branches',
      financial: '/api/superadmin/financial',
      analytics: '/api/superadmin/analytics',
    },
  });
});

// Mount API Routes
app.use('/api/superadmin/auth', require('./routes/authRoutes'));

// Additional routes (will be added in next steps)
// app.use('/api/superadmin/users', require('./routes/userRoutes'));
// app.use('/api/superadmin/branches', require('./routes/branchRoutes'));
// app.use('/api/superadmin/financial', require('./routes/financialRoutes'));
// app.use('/api/superadmin/analytics', require('./routes/analyticsRoutes'));

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`🏋️  FitZone Super Admin API Server`);
  console.log('🚀 ========================================');
  console.log(`📡 Server running on port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log('🚀 ========================================');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
