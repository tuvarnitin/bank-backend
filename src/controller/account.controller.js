const accountModel = require("../models/account.model")


async function createAccountController(req,res){
    
    const userAccount = await accountModel.create({user:req.user._id})
    return res.status(201).json({
        account:userAccount
    })
}


module.exports = {
    createAccountController
}