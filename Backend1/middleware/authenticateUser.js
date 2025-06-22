const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided, authorization denied' 
      });
    }

    // Check if token starts with Bearer
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found, token invalid' 
      });
    }

    // Check if user is active (not for providers in pending state)
    if (user.role === 'provider' && user.status === 'rejected') {
      return res.status(403).json({ 
        success: false,
        message: 'Account access denied' 
      });
    }

    // Add user to request object
    req.user = user;
    
    // Update last active
    user.updateLastActive().catch(err => {
      console.error('Error updating last active:', err);
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error in authentication' 
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
};

// Middleware to check if user is provider
const requireProvider = (req, res, next) => {
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Provider access required' 
    });
  }
};

// Middleware to check if user is customer
const requireCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Customer access required' 
    });
  }
};

// Middleware to check if user is active provider
const requireActiveProvider = (req, res, next) => {
  if (req.user && req.user.isActiveProvider()) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Active provider access required' 
    });
  }
};

module.exports = {
  authenticateUser,
  requireAdmin,
  requireProvider,
  requireCustomer,
  requireActiveProvider
};