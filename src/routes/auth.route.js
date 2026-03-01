const userConroller = require("../controller/user.controller");
const route = require("express").Router()


/* POST /api/auth/register */
route.post("/register", userConroller.userRegisterController)


module.exports = route