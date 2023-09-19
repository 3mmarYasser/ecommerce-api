const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

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


UserSchema.pre("save", async function  hashPassword(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})
UserSchema.pre("findOneAndUpdate", async function (next ) {
    if(!this._update.password) return next();
    this._update.password = await bcrypt.hash(this._update.password, 12);
    next();
})

const User = mongoose.model("User", UserSchema);
module.exports = User;