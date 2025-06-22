const logout = async (req, res) => {
    try {
        // Clear the HTTP-only cookie if you're using cookies
        res.clearCookie('token');
        
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { logout };