const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user_schema = require('../models/user_model');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email and password are required' 
        });
    }

    try {
        const user = await user_schema.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                role: user.role || 'user'
            },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

// Change this line from: module.exports = login;
// To this:
module.exports = { login };