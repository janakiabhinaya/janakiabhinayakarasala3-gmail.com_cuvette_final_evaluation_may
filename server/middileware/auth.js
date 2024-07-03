const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('Decoded JWT payload:', decoded);
        req.user = decoded; // Set userId in request object
        next();
    });
};

module.exports = authenticateToken;
