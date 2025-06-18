const mongoose = require('../utils/schema');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  profile_photo: {
    type: Buffer,
  },

  role: {
    type: String,
    enum: ['customer', 'provider', 'admin'],
    default: 'customer',
  },

  serviceType: {
    type: String,
    required: function () {
      return this.role === 'provider';
    },
  },
  contact: {
    type: Number,
    required: function () {
      return  this.role === 'provider';
    },
  },
  address: {
    type: String,
    required: function () {
      return this.role === 'provider';
    },
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    required: function () {
      return this.role === 'provider';
    },
  },
  status: {
  type: String,
  enum: ['pending', 'inqueue', 'approved'],
  default: 'pending'
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
