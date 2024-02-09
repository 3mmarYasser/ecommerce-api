const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");

const generateToken = (user) => {
    return jwt.sign({userId:user._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

exports.signup = asyncHandler(async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });
    const token =  generateToken(user);

    res.status(201).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
});
exports.signin =asyncHandler(async(req ,res,next)=>{
    const {username , password} = req.body;
    const user = await User.findOne({username});
    const match = user ? await bcrypt.compare(password, user.password): false;
    if(!match || !user){
        return  next(new ApiError("Incorrect Password or Username",401))
    }
   const token =  generateToken(user);
    res.status(201).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
})
exports.auth = asyncHandler(async (req, res, next) => {
    if((req.headers.authorization) && req.headers.authorization.startsWith("Bearer")){
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const currentUser = await User.findById(decoded.userId);

        if(!currentUser){
            return next(new ApiError("The user belonging to this token does no longer exist",401))
        }

        if(currentUser.passwordChangedAt){
            if(decoded.iat*1000 < currentUser.passwordChangedAt.getTime()){
                return next(new ApiError("User recently changed password! Please log in again",401))
            }
        }

        req.user = currentUser;
        next();

    }else {
        return next(new ApiError("You are not logged in! Please log in to get access",401))
    }

});