const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

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

exports.allowedTo =(...roles)=> asyncHandler(async (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return next(new ApiError("You do not have permission to perform this action",403))
    }
    next();
});
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user  = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ApiError("There is no user with email address",404))
    }
    const resetCode = Math.floor(100000+Math.random()*900000).toString();
    const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");

    const message = `Your Password Reset Code is ${resetCode}`;
   const html= `
<h1>Hi There ${user.username} </h1> 
<p>This is your Password reset Code</p>
      <div style="padding:0;margin:0;height:100%;width:100%;font-family:'FF Mark W05',Arial,sans-serif">
      <div style="margin:0 auto;max-width:600px;display:block;font-family:inherit">
      <table cellpadding="0" cellspacing="0" style="padding:0;border-spacing:0;background:#f0f0f0;border:0;margin:0;text-align:center;vertical-align:middle;font-weight:500;table-layout:fixed;border-collapse:collapse;height:100%;width:100%;line-height:100%" width="100%" height="100%" align="center" valign="middle"><tbody><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit">
      <td style="margin:0;padding:0;border:none;border-spacing:0;background:#f0f0f0;border-collapse:collapse;font-family:inherit"><table cellpadding="0" cellspacing="0" style="margin:0;border-spacing:0;border:0;padding:0;width:100%;border-collapse:collapse" width="100%"><tbody><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td style="margin:0;padding:0;border:none;border-spacing:0;text-align:center;border-collapse:collapse;font-family:inherit" align="center"><table cellpadding="0" cellspacing="0" style="margin:0;padding:0;border:none;border-spacing:0;width:100%;border-collapse:collapse" width="100%"><tbody><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td colspan="3" style="margin:0;padding:0;border:none;border-spacing:0;height:64px;border-collapse:collapse;font-family:inherit" height="64"><table style="margin:0;padding:0;border:none;border-spacing:0;width:100%;border-collapse:collapse" width="100%"></table></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td class="m_5928523427544322001hTfFsy" style="margin:0;padding:0;border:none;border-spacing:0;height:100%;overflow:hidden;width:72px;border-collapse:collapse;font-family:inherit" width="72" height="100%"><div class="m_5928523427544322001hTfFsy" style="height:100%;overflow:hidden;width:72px;font-family:inherit"></div></td><td style="margin:0;padding:0;border:none;border-spacing:0;text-align:center;border-collapse:collapse;font-family:inherit" align="center"><table cellpadding="0" cellspacing="0" style="margin:0;padding:0;border:none;border-spacing:0;width:100%;background-color:#f9f9f9;border-collapse:collapse" width="100%" bgcolor="#F9F9F9"><tbody><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td colspan="3" style="margin:0;padding:0;border:none;border-spacing:0;height:40px;border-collapse:collapse;font-family:inherit" height="40"><table style="margin:0;padding:0;border:none;border-spacing:0;width:100%;border-collapse:collapse" width="100%"></table></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td class="m_5928523427544322001gkvQUv" style="margin:0;padding:0;border:none;border-spacing:0;height:100%;overflow:hidden;width:38px;border-collapse:collapse;font-family:inherit" width="38" height="100%"><div class="m_5928523427544322001gkvQUv" style="height:100%;overflow:hidden;width:38px;font-family:inherit"></div></td><td style="margin:0;padding:0;border:none;border-spacing:0;text-align:center;border-collapse:collapse;font-family:inherit" align="center"><table style="margin:0;padding:0;border:none;border-spacing:0;width:100%;table-layout:fixed;border-collapse:collapse" width="100%"><tbody><tr><td><h2 style="font-size:25.63px;font-weight:700;line-height:100%;color:#333;margin:0;text-align:center;font-family:inherit"> </h2></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td colspan="1" style="margin:0;padding:0;border:none;border-spacing:0;height:8px;border-collapse:collapse;font-family:inherit" height="8"><table style="margin:0;padding:0;border:none;border-spacing:0;width:100%;border-collapse:collapse" width="100%"></table></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td style="margin:0;padding:0;border:none;border-spacing:0;text-align:center;border-collapse:collapse;font-family:inherit" align="center"><p style="margin:0;padding:0;font-weight:500;font-size:18px;line-height:140%;letter-spacing:-0.01em;color:#666;font-family:inherit">Your Password Reset Code is</p></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td colspan="1" class="m_5928523427544322001kAINMw" style="margin:0;padding:0;border:none;border-spacing:0;height:40px;border-collapse:collapse;font-family:inherit" height="40"><table style="margin:0;padding:0;border:none;border-spacing:0;width:100%;border-collapse:collapse" width="100%"></table></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td style="margin:0;padding:0;border:none;border-spacing:0;text-align:center;border-collapse:collapse;font-family:inherit" align="center"><table class="m_5928523427544322001lloNHj" style="margin:0;padding:0;border:none;border-spacing:0;width:100%;margin-left:0.7em;border-collapse:collapse" width="100%"><tbody><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit">
       <td class="m_5928523427544322001Rnkmq" style="margin:0;padding:0;border:none;border-spacing:0;line-height:100%;text-align:center;font-size:37px;line-height:100%;text-transform:uppercase;letter-spacing:0.7em;border-collapse:collapse;font-family:inherit" align="center">
  ${resetCode}
  </td>
 </tr></tbody></table></td></tr></tbody></table></td><td class="m_5928523427544322001gkvQUv" style="margin:0;padding:0;border:none;border-spacing:0;height:100%;overflow:hidden;width:38px;border-collapse:collapse;font-family:inherit" width="38" height="100%"><div class="m_5928523427544322001gkvQUv" style="height:100%;overflow:hidden;width:38px;font-family:inherit"></div></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td colspan="3" style="margin:0;padding:0;border:none;border-spacing:0;height:48px;border-collapse:collapse;font-family:inherit" height="48"><table style="margin:0;padding:0;border:none;border-spacing:0;width:100%;border-collapse:collapse" width="100%"></table></td></tr></tbody></table></td><td class="m_5928523427544322001hTfFsy" style="margin:0;padding:0;border:none;border-spacing:0;height:100%;overflow:hidden;width:72px;border-collapse:collapse;font-family:inherit" width="72" height="100%"><div class="m_5928523427544322001hTfFsy" style="height:100%;overflow:hidden;width:72px;font-family:inherit"></div></td></tr><tr style="margin:0;padding:0;border:none;border-spacing:0;border-collapse:collapse;font-family:inherit"><td colspan="3" style="margin:0;padding:0;border:none;border-spacing:0;height:48px;border-collapse:collapse;font-family:inherit" height="48"><table style="margin:0;padding:0;border:none;border-spacing:0;width:100%;border-collapse:collapse" width="100%"></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>
    </div>
    <p>Ecommerce API App</p>
    <p>Thanks.</p>

`;
   await sendEmail(user.email,`Password Reset Code : ${resetCode}`,message,html).then(
       ()=>{
           user.passwordResetCode = hashedResetCode;
           user.passwordResetExpires = Date.now() + 10*60*1000;
           user.passwordResetVerified = false;
       },
       ()=>{
           return next(new ApiError("There was an error sending the email. Try again later",500))
       }
   );

    await user.save();

    res.status(200).json({
        status:"success",
        message:"Reset Code Sent To Your Email"
    })
})

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");
    const user = await User.findOne({passwordResetCode:hashedResetCode , passwordResetExpires:{$gt:Date.now()}});
    if(!user){
        return next(new ApiError("Invalid Reset Code", 400));
    }
    user.passwordResetVerified = true;
    await user.save();
    res.status(200).json({
        status:"success",
        message:"Reset Code Verified"
    })
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ApiError("There is no user with email address",404))
    }
    if(!user.passwordResetVerified){
        return next(new ApiError("Reset Code Not Verified", 400))
    }
    if(user.passwordResetExpires < Date.now()){
        return next(new ApiError("Reset Code Expired ", 400))
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires =undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    const token =  generateToken(user);

    res.status(200).json({
        status:"success",
        token,
        message:"Password Reset Successfully"
    })
});