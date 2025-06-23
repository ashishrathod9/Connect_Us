const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Simple and permissive CORS configuration
app.use(cors({
  origin: [
    'https://connect-us-xi.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// Additional middleware for handling preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  next();
});

// Routes
const serviceCategoryRoutes = require('./Routes/serviceCategory_routes');
const serviceRoutes = require('./Routes/service_routes');
const bookingRoutes = require('./Routes/booking_routes');
const userRoutes = require('./Routes/user_routes');


// Register routes with correct paths
app.use('/api/service-categories', serviceCategoryRoutes); // This should match your frontend call
app.use('/api/categories', serviceCategoryRoutes); // Alternative route
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'ConnectUs Backend Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    cors: 'Enabled for Vercel frontend'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'ConnectUs API Server',
    version: '1.0.0',
    status: 'Running',
    frontend: 'https://connect-us-xi.vercel.app',
    allowedOrigins: [
      'https://connect-us-xi.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.process.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server URL: https://connect-us-1.onrender.com`);
    console.log(`Frontend URL: https://connect-us-xi.vercel.app`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log('CORS enabled for:', [
      'https://connect-us-xi.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ]);
  });
};

startServer();

module.exports = app;