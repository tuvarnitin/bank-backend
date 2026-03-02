const userConroller = require("../controller/user.controller");
const route = require("express").Router()

/* POST /api/auth/register */
route.post("/register", userConroller.userRegisterController)

/* POST /api/auth/login */
route.post("/login", userConroller.userLogiController)

module.exports = route