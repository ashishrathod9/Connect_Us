const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'provider', 'admin'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active'],
    default: function() {
      return this.role === 'provider' ? 'pending' : 'active';
    }
  },
  profilePhoto: {
    type: String,
    default: null
  },
  address: {
    type: String,
    trim: true
  },
  // Provider-specific fields
  serviceType: {
    type: String
  },
  contact: {
    type: String // Business contact
  },
  businessName: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  pricing: {
    type: String,
    trim: true
  },
  availability: {
    type: [String], // Array of available days/times
    default: []
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ serviceType: 1 });

// Virtual for full name or display name
userSchema.virtual('displayName').get(function() {
  return this.businessName || this.name;
});

// Method to check if user is active provider
userSchema.methods.isActiveProvider = function() {
  return this.role === 'provider' && this.status === 'approved';
};

// Method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);