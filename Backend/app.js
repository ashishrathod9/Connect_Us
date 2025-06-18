const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const serviceCategoryRoutes = require('./Routes/serviceCategory_routes');
const serviceRoutes = require('./Routes/service_routes');

const app = express();




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// Database connection
mongoose.connect('mongodb+srv://ashishrathod53839:ashishashish@cluster1.vki9pld.mongodb.net/connectus1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});




// Routes
app.use('/api/service-categories', serviceCategoryRoutes);
app.use('/api/services', serviceRoutes);


// Your existing routes would go here as well
const userRoutes = require('./Routes/user_routes');

app.use("/user" , userRoutes);




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




module.exports = app;