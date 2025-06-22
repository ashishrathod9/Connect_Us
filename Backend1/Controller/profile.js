const User = require('../models/user_model');

const profile = async (req, res) => {
    try {
        console.log('Profile endpoint hit');
        console.log('User from token:', req.user);
        
        // Get user email from the authenticated token
        const userEmail = req.user.email;
        
        if (!userEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find user by email and exclude password from response
        const user = await User.findOne({ email: userEmail }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert profile_photo buffer to base64 if it exists
        let userData = user.toObject();
        if (userData.profile_photo) {
            userData.profile_photo = `data:image/jpeg;base64,${userData.profile_photo.toString('base64')}`;
        }

        res.status(200).json(userData);
        
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { profile };