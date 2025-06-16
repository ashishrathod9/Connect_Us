const jwt = require('jsonwebtoken');
const user_schema = require('../models/user_model');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, password , role} = req.body;

    try {
        const user = await user_schema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ email : user.email , role : user.role}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        console.log('Generated JWT token:', token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
        });


        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { login };