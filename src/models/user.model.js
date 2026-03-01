const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be of 8 characters"],
        select: false
    }
})



userSchema.methods.comparePassword = function (password) {
    console.log(password, this.password)
    return bcryptjs.compare(password, this.password)
}

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcryptjs.hash(this.password, 10);
});

const userModel = mongoose.model("user", userSchema)

module.exports = userModel