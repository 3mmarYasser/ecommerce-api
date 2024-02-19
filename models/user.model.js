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
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified:Boolean,
    role:{
        type: String,
        enum: ["user","manager","admin"],
        default: "user",
    },
    active:{
        type: Boolean,
        default: true,
    },
    wishlist:[
        {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
        }
    ],
    addresses:[
        {
            id:{type: mongoose.Schema.Types.ObjectId},
            alias:String,
            details:String,
            phone:String,
            city:String,
            postalCode:String,

        }
    ],

},{timestamps: true});


UserSchema.pre("save", async function  hashPassword(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})
UserSchema.pre("findOneAndUpdate", async function (next) {
    if(!this._update.password) return next();
    this._update.password = await bcrypt.hash(this._update.password, 12);
    this._update.passwordChangedAt = Date.now();
    next();
})
UserSchema.pre(/^find/, function (next) {
    this.find({active: {$ne: false}});
    next();
})

const User = mongoose.model("User", UserSchema);
module.exports = User;