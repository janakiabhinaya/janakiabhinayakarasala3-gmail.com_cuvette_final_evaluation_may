const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();
const generateAuthToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '120h' }); // Change expiresIn as per your requirement
};

module.exports = generateAuthToken;
