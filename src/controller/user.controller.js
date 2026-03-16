const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blacklistedtoken.model");

/**
 * - USer Register Controller
 * - POST /api/auth/register
 */

async function userRegisterController(req, res) {
    const { email, password, name } = req.body;

    const isExists = await userModel.findOne({ email })

    if (isExists) {
        return res.status(409).json({
            message: "User already exists with this email"
        })
    }

    const user = await userModel.create({ email, password, name })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("token", token)

    res.status(201).json({
        message:"User registered successfully.",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })

    await emailService.sendRegisterationEmail(user.email, user.name)

}


/**
 * - User Login Controller
 * - POST /api/auth/login
 */

async function userLogiController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)


    return res.status(200).json({
        message: "Login successfully.",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })

}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
*/

async function userLogoutController(req,res){
    const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];

    if(!token){
        return res.status(200).json({
            message:"User logout successfully."
        })
    }

    await tokenBlackListModel.create({token});

    res.clearCookie("token");

    res.status(200).json({
        message:"User logout successfully."
    })
}



module.exports ={
    userRegisterController,
    userLogiController,
    userLogoutController
}