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
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Import routes
const serviceCategoryRoutes = require('./Routes/serviceCategory_routes');
const serviceRoutes = require('./Routes/service_routes');
const bookingRoutes = require('./Routes/booking_routes'); // Make sure this exists
const userRoutes = require('./Routes/user_routes');


// Register routes
app.use('/api/service-categories', serviceCategoryRoutes);
app.use('/api/categories', serviceCategoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes); // This is crucial!
app.use('/api/users', userRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server running',
    routes: {
      'service-categories': '/api/service-categories',
      'services': '/api/services',
      'bookings': '/api/bookings', // Show this in health check
      'users': '/api/users'
    }
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
      '/api/users'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Route not found:', req.originalUrl);
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    requestedRoute: req.originalUrl,
    availableRoutes: [
      '/api/service-categories',
      '/api/services',
      '/api/bookings',
      '/api/users'
    ]
  });
});

// Database connection and server start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- /api/bookings (POST, GET)');
    console.log('- /api/service-categories (GET)');
    console.log('- /api/services (GET)');
  });
};

startServer();

module.exports = app;