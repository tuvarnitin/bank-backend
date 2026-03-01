const express = require("express")
require("dotenv").config()

const app = express()

const connectToDB = require("./config/db.config")

app.get("/",(req,res)=>{
    res.send("Server is running");
})

connectToDB()


module.exports = app