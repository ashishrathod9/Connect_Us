const User = require('../models/user_model');

const profile = async (req, res) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      username: user.username,
      email: user.email,
      profile_photo: user.profile_photo
        ? user.profile_photo.toString('base64')
        : null,
      serviceType: user.serviceType,
      contact: user.contact,
      address: user.address,
    };

    res.status(200).json(userProfile);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { profile };