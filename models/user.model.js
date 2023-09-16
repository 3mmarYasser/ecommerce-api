const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username already exists"],
        trim: true,
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique: [true, "Email already exists"],
        trim: true,
    },
    phone:{
        type: String,
    },
    profileImage:{
        type: String,
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    active:{
        type: Boolean,
        default: true,
    }
},{timestamps: true});

const User = mongoose.model("User", UserSchema);
module.exports = User;