const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateUser } = require('../middleware/authenticateUser');
const user_schema = require('../models/user_model'); // Add this import
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser
} = require('../Controller/user');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.post('/register', upload.single('profile_photo'), registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile/update', authenticateUser, upload.single('profilePhoto'), updateUserProfile);
router.post('/request-provider', authenticateUser, async (req, res) => {
    try {
        const userId = req.user._id;

        const currentUser = await user_schema.findById(userId).select('role');
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (currentUser.role === 'provider') {
            return res.status(400).json({ message: 'User is already a provider' });
        }

        const updatedUser = await user_schema.findByIdAndUpdate(
            userId,
            { role: 'provider', status: 'pending' },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found during update' });
        }
        
        res.status(200).json({ 
            message: 'Provider request submitted successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error('Error requesting provider status:', err);
        res.status(500).json({ message: 'Failed to submit provider request' });
    }
});
router.get('/all', authenticateUser, getAllUsers);
router.delete('/:id', authenticateUser, deleteUser);

// Admin routes for customers and providers
router.get('/admin/all_customers', authenticateUser, async (req, res) => {
    try {
        const users = await user_schema.find({ role: 'customer' });
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ message: 'Failed to fetch customers' });
    }
});

router.get('/admin/all_providers', authenticateUser, async (req, res) => {
    try {
        const providers = await user_schema.find({ role: 'provider' });
        res.status(200).json(providers);
    } catch (err) {
        console.error('Error fetching providers:', err);
        res.status(500).json({ message: 'Failed to fetch providers' });
    }
});

// Provider application routes
router.get('/admin/applications', authenticateUser, async (req, res) => {
    try {
        const applications = await user_schema.find({ 
            role: 'provider', 
            status: 'pending' 
        });
        res.status(200).json(applications);
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

router.put('/admin/approve/:id', authenticateUser, async (req, res) => {
    try {
        const provider = await user_schema.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        
        res.status(200).json({ 
            message: 'Provider approved successfully',
            provider 
        });
    } catch (err) {
        console.error('Error approving provider:', err);
        res.status(500).json({ message: 'Failed to approve provider' });
    }
});

router.put('/admin/reject/:id', authenticateUser, async (req, res) => {
    try {
        const provider = await user_schema.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        
        res.status(200).json({ 
            message: 'Provider rejected successfully',
            provider 
        });
    } catch (err) {
        console.error('Error rejecting provider:', err);
        res.status(500).json({ message: 'Failed to reject provider' });
    }
});

module.exports = router;