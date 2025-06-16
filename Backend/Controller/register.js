const user_schema = require('../models/user_model');
const bcrypt = require('bcrypt');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const register = async (req, res) => {
    const { username, password, email } = req.body;
    const profilePhoto = req.file ? req.file.buffer : null;


    try {
        const existingUser = await user_schema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user_schema({
            username,
            password: hashedPassword,
            email,
            profilePhoto
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { register };
