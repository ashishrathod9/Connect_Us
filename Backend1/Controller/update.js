// Controller/update.js
const User = require('../models/user_model');

const update_user = async (req, res) => {
  try {
    console.log('Update user endpoint hit');
    console.log('User from token:', req.user);
    console.log('Request body:', req.body);
    
    const userId = req.user.userId;
    const updateData = req.body;
    
    // Handle file upload if present
    if (req.file) {
      updateData.profile_photo = req.file.buffer; // or however you handle file storage
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

module.exports = { update_user };