const authorizeAdmin = (req, res, next) => {
    try {
        console.log('Admin authorization middleware hit');
        console.log('User role:', req.user?.role);
        
        // Check if user exists in request (should be set by authenticateUser middleware)
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        next();
        
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(500).json({ message: 'Authorization failed' });
    }
};

module.exports = authorizeAdmin;