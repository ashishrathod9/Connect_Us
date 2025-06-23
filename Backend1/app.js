const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://connect-us-xi.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.path.includes('/bookings')) {
    console.log('🔍 BOOKING REQUEST DETECTED');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  }
  next();
});

// Import routes with error handling
let bookingRoutes;
try {
  bookingRoutes = require('./Routes/booking_routes');
  console.log('✅ Booking routes imported successfully');
} catch (error) {
  console.error('❌ Failed to import booking routes:', error.message);
  console.error('Make sure ./Routes/booking_routes.js exists and exports properly');
}

const serviceCategoryRoutes = require('./Routes/serviceCategory_routes');
const serviceRoutes = require('./Routes/service_routes');
const userRoutes = require('./Routes/user_routes');

// Register routes with debugging
console.log('🚀 Registering routes...');

app.use('/api/service-categories', serviceCategoryRoutes);
console.log('✅ Service categories routes registered');

app.use('/api/categories', serviceCategoryRoutes);
console.log('✅ Categories routes registered');

app.use('/api/services', serviceRoutes);
console.log('✅ Services routes registered');

if (bookingRoutes) {
  app.use('/api/bookings', bookingRoutes);
  console.log('✅ Booking routes registered at /api/bookings');
} else {
  console.error('❌ Booking routes NOT registered - check import errors above');
}

app.use('/api/users', userRoutes);
console.log('✅ User routes registered');

// Test route to verify booking registration
app.get('/api/test-bookings', (req, res) => {
  res.json({
    success: true,
    message: 'Direct booking test route works',
    registeredRoutes: app._router ? app._router.stack.map(layer => layer.regexp.source) : 'Router info not available'
  });
});

// Health check with more detailed info
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server running',
    timestamp: new Date().toISOString(),
    routes: {
      'service-categories': '/api/service-categories',
      'services': '/api/services',
      'bookings': '/api/bookings',
      'users': '/api/users',
      'test-bookings': '/api/test-bookings'
    },
    bookingRoutesLoaded: !!bookingRoutes
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'ConnectUs API Server',
    status: 'Running',
    availableRoutes: [
      '/api/service-categories',
      '/api/services', 
      '/api/bookings',
      '/api/users',
      '/api/test-bookings'
    ],
    bookingRoutesStatus: bookingRoutes ? 'Loaded' : 'Failed to load'
  });
});

// Enhanced 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  console.log('Method:', req.method);
  console.log('Available routes check:');
  
  if (req.originalUrl.includes('/bookings')) {
    console.log('🔍 This is a booking route request!');
    console.log('Booking routes loaded:', !!bookingRoutes);
  }
  
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    requestedRoute: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/api/service-categories',
      '/api/services',
      '/api/bookings',
      '/api/users'
    ],
    bookingRoutesStatus: bookingRoutes ? 'Loaded' : 'Not loaded'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Database connection and server start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('📋 Available routes:');
    console.log('  - GET  /api/bookings (list routes)');
    console.log('  - GET  /api/bookings/test (test route)');
    console.log('  - POST /api/bookings (create booking)');
    console.log('  - GET  /api/bookings/my-bookings');
    console.log('  - GET  /api/bookings/provider/bookings');
    console.log('  - GET  /api/service-categories');
    console.log('  - GET  /api/services');
    console.log('  - GET  /health');
    console.log('\n🧪 Test your booking routes:');
    console.log(`  curl http://localhost:${PORT}/api/bookings/test`);
    console.log(`  curl http://localhost:${PORT}/api/bookings`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      mongoose.connection.close();
    });
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;