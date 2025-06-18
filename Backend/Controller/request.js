const User = require('../models/user_model');

const request_ = async (req, res) => {
  try {
    const { username, serviceType, contact, address } = req.body;
    const profilePhoto = req.file ? req.file.buffer : null;
    const email = req.user.email;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        username,
        profilePhoto,
        serviceType,
        contact,
        address,
        role: 'provider',
        status: 'inqueue',
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Provider request sent successfully',
      user: {
        username: updatedUser.username,
        serviceType: updatedUser.serviceType,
        contact: updatedUser.contact,
        address: updatedUser.address,
        approve_status: updatedUser.approve_status,
      },
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { request_ };
