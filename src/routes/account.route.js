const route = require("express").Router()
const accountController = require("../controller/account.controller")
const authMiddelware = require("../middleware/auth.middelware")

route.post("/",authMiddelware.authMiddelware,accountController.createAccountController)

module.exports = route