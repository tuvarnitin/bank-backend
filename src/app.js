const express = require("express")
require("dotenv").config()

const app = express()

const connectToDB = require("./config/db.config")

const authRoute = require("./routes/auth.route")


app.use(express.json())

app.use("/api/auth",authRoute)

connectToDB()




module.exports = app