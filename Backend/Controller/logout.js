const logout = (req, res) => {
    let token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

module.exports = { logout };