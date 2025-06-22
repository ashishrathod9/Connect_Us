const mongoose = require('mongoose');

// Remove the mongoose.connect() call - connection should only be in app.js
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project');

module.exports = mongoose;
