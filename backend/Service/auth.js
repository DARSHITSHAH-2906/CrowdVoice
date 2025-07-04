const jwt = require("jsonwebtoken")
require('dotenv').config()

const generateJWTtoken = (user) => {
    const payload = {
        _id: user._id,
        email: user.email
    };
    const token = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '15m' });
    return token;
}

const generateToken = (user, res) => {
    const payload = {
        _id: user._id,
        email: user.email
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, { expiresIn: '7d' });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,           // required for cross-site with SameSite=None
        sameSite: "None",       // must be None for cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return accessToken;
}

const getUser = (token) => {
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, process.env.ACCESS_KEY);
    } catch {
        return null;
    }
}

const RefreshToken = (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.ACCESS_KEY, { expiresIn: '15m' });
        res.status(200).json({ token: accessToken });
    })
}

const VerifyUser = (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(" ")[1];
        const user = getUser(token);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        res.status(200).json({ message: "User Verified" });
    } else {
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = { generateJWTtoken, getUser, generateToken, RefreshToken, VerifyUser };