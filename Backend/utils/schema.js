const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/project');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project');
module.exports = mongoose;

