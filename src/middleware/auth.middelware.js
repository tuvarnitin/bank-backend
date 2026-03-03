const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")

async function authMiddelware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
        console.log(token)
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        const user =  await userModel.findOne({_id:userId})
        req.user = user;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {
    authMiddelware
}
