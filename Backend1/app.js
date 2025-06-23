const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration
// const corsOptions = {
//     origin: [
//       'https://connect-us-xi.vercel.app',
      
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: [
//       'Origin',
//       'X-Requested-With',
//       'Content-Type',
//       'Accept',
//       'Authorization',
//       'Cache-Control',
//       'Pragma'
//     ],
//     exposedHeaders: ['Authorization'],
//     maxAge: 86400
// };

// console.log('CORS options in use:', corsOptions);

// app.use(cors(corsOptions));

// const cors = require("cors");

const allowedOrigins = [
  "https://connect-us-xi.vercel.app",
//   "http://localhost:3000" // optional for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// Handle preflight requests
// app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
const serviceCategoryRoutes = require('./Routes/serviceCategory_routes');
const serviceRoutes = require('./Routes/service_routes');
const bookingRoutes = require('./Routes/booking_routes');
const userRoutes = require('./Routes/user_routes');
const authRoutes = require('./Routes/auth_routes');

app.use('/api/categories', serviceCategoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      message: 'ConnectUs Backend Server is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
      message: 'ConnectUs API Server',
      version: '1.0.0',
      status: 'Running',
      endpoints: {
        health: '/health',
        api: '/api',
        categories: '/api/categories',
        services: '/api/services',
        bookings: '/api/bookings',
        users: '/api/users',
        auth: '/api/auth'
      }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
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
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
};

startServer();

module.exports = app;