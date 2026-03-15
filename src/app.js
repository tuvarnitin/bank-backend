const express = require("express")
require("dotenv").config()
const cookieParser = require("cookie-parser")

const authRoute = require("./routes/auth.route")
const accountRoute = require("./routes/account.route")
const transactionRoute = require("./routes/transaction.route")
const connectToDB = require("./config/db.config")

const app = express()

connectToDB()
cookieParser()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoute)
app.use("/api/account",accountRoute)
app.use("/api/transactions",transactionRoute)

module.exports = app