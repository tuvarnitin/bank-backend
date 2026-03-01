const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")


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

    return res.status(201).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })

}


module.exports ={
    userRegisterController
}