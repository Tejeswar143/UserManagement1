const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').split(" ")[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).send('Forbidden');
        }
    });
};
const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'user') {
            next();
        } else {
            return res.status(403).send('Forbidden');
        }
    });
};
module.exports = { verifyAdmin, verifyUser };


