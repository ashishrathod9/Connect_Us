const User = require('../models/user_model');

const request_ = async (req, res) => {
    try {
        console.log('Provider request endpoint hit');
        console.log('User from token:', req.user);
        
        const userEmail = req.user.email;
        
        if (!userEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find the user
        const user = await User.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already a provider or has pending request
        if (user.role === 'provider') {
            return res.status(400).json({ message: 'User is already a provider' });
        }

        if (user.status === 'inqueue') {
            return res.status(400).json({ message: 'Provider request already pending' });
        }

        // Extract provider information from request body
        const { serviceType, address, contact } = req.body;

        if (!serviceType || !address || !contact) {
            return res.status(400).json({ 
                message: 'Service type, address, and contact are required for provider request' 
            });
        }

        // Update user to provider with pending status
        user.role = 'provider';
        user.status = 'inqueue';
        user.serviceType = serviceType;
        user.address = address;
        user.contact = contact;

        await user.save();

        res.status(200).json({ 
            message: 'Provider request submitted successfully. Please wait for admin approval.',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                serviceType: user.serviceType,
                address: user.address,
                contact: user.contact
            }
        });

    } catch (error) {
        console.error('Error processing provider request:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { request_ };