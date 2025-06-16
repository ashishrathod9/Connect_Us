const mongoose = require('../utils/schema');

const serviceProviderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profile_photo : {
    type : Buffer,
    required: false,
  },
  contact : {
    type : Number,
    required : true,
  },
  address : {
    type: String,
    required: true,
  },
  isServiceProvider: {
    type: Boolean,
    default: true,
  },
    serviceType: {
        type: String,
        required: true,
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Provider = mongoose.model('Provider', serviceProviderSchema);
module.exports = Provider;