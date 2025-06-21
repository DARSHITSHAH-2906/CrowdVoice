const jwt = require("jsonwebtoken")
require('dotenv').config()

const generateJWTtoken = (user) => {
    const payload = {
        _id: user._id,
        email: user.email
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
    console.log(token);
    return token;
}

const getUser = (token) => {
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch {
        return null;
    }
}

module.exports = { generateJWTtoken , getUser }