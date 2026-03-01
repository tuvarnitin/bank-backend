const express = require("express")
require("dotenv").config()

const authRoute = require("./routes/auth.route")
const connectToDB = require("./config/db.config")

const app = express()

connectToDB()
app.use(express.json())

app.use("/api/auth",authRoute)

module.exports = app