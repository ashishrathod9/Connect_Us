const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '24h' }
    );
};

// Register user
const registerUser = async (req, res) => {
    console.log('Register endpoint hit');
    console.log('Request body:', req.body);
    
    const { name, password, email, phone, role, serviceType, address, contact } = req.body;
    const profile_photo = req.file ? req.file.buffer : null;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name: name,
            password: hashedPassword,
            email,
            phone,
            profilePhoto: profile_photo,
            role: role || 'customer'
        };

        if (role === 'provider') {
            userData.serviceType = serviceType;
            userData.contact = contact;
            userData.address = address;
            userData.status = 'pending';
        }

        console.log('UserData before saving:', userData);

        const newUser = new User(userData);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email and password are required' 
        });
    }

    try {
        const user = await User.findOne({ email });
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
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role || 'user',
                profilePhoto: user.profilePhoto,
                address: user.address,
                contact: user.contact,
                serviceType: user.serviceType,
                status: user.status
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

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        console.log('Profile endpoint hit');
        console.log('User from token:', req.user);
        
        const userEmail = req.user.email;
        
        if (!userEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findOne({ email: userEmail }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let userData = user.toObject();
        if (userData.profilePhoto) {
            userData.profilePhoto = `data:image/jpeg;base64,${userData.profilePhoto.toString('base64')}`;
        }

        res.status(200).json(userData);
        
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        console.log('Update user endpoint hit');
        console.log('User from token:', req.user);
        console.log('Request body:', req.body);
        
        const userId = req.user._id;
        const updateData = req.body;
        
        // Handle file upload if present
        if (req.file) {
            updateData.profilePhoto = req.file.buffer;
        }
        
        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });
        
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            users,
            count: users.length
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser
}; 