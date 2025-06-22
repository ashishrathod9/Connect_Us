const bcrypt = require('bcryptjs');
const user_schema = require('../models/user_model'); // Adjust path as needed

const register = async (req, res) => {
    console.log('Register endpoint hit');
    console.log('Request body:', req.body);
    
    const { name, password, email, phone, role, serviceType, address, contact } = req.body;
    const profile_photo = req.file ? req.file.buffer : null;

    try {
        const existingUser = await user_schema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name: name,
            password: hashedPassword,
            email,
            phone, // Make sure phone is included here
            profile_photo,
            role: role || 'customer'
        };

        if (role === 'provider') {
            userData.serviceType = serviceType;
            userData.contact = contact;
            userData.address = address;
            userData.status = 'pending';
        }

        console.log('UserData before saving:', userData); // Debug log

        const newUser = new user_schema(userData);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { register };