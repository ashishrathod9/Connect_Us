const user_schema = require('../models/user_model');
const update_user = async (req, res) => {
    try {
        const email = req.user.email;
        const { username, password } = req.body;
        const profilePhoto = req.file ? req.file.buffer : null;

        const updatedUser = await user_schema.findOneAndUpdate(
            { email },
            {
                username,
                password, 
                profile_photo: profilePhoto
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { update_user };