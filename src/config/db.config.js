const mongoose = require("mongoose")

async function connectToDB() {
    mongoose.connect(process.env.MONGO_URI).
    then(function(){
        console.log("Mongo db connected")
    })
}

module.exports = connectToDB