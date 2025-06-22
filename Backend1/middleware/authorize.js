const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. You must have one of the following roles: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

const authorizeAdmin = authorize('admin');
const authorizeProvider = authorize('provider');
const authorizeAdminOrProvider = authorize('admin', 'provider');

module.exports = {
  authorize,
  authorizeAdmin,
  authorizeProvider,
  authorizeAdminOrProvider,
}; 