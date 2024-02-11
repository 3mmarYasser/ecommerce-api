const asyncHandler = require("express-async-handler");
const handlerFactory = require("./handlerFactory.service")
const {uploadSingleImage} = require("../middlewares/upload.middleware");
const {v4:uuid4} = require("uuid");
const {dirExist} = require("../utils/dirExist");
const sharp = require("sharp");
const User = require('../models/user.model');
const generateToken = require("../utils/generateToken");

exports.uploadUserImage = uploadSingleImage( "profileImage")

exports.resizeUserImage = async (req, res, next) => {
    if(req.file){
        const dir = "uploads/users";
        const filename = `user-${uuid4()}-${Date.now()}.png`;
        dirExist(dir);
        await sharp(req.file.buffer)
            .resize(400, 400)
            .toFormat("png")
            .png({quality: 90})
            .toFile(`${dir}/${filename}`);
        req.body.profileImage = `/${dir.split("/")[1]}/${filename}`;
    }
    next()
};
exports.getUsers = handlerFactory.getAll(User,[],["username","email","phone","role"]);

exports.getUserById = handlerFactory.getOne(User);

exports.createUser = handlerFactory.createOne(User);


exports.updateUser =  handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);

exports.getLoggedUserData = asyncHandler(async (req , res,next)=>{
    req.params.id = req.user._id;
    next();
})
exports.updateLoggedUser =  handlerFactory.updateOne(User,[],["email","phone","profileImage"]);
exports.changeLoggedUserPassword = handlerFactory.updateOne(User,[],["password","passwordChangedAt"],
(req)=> {return {token:generateToken(req.user)}}
);
exports.deleteLoggedUser = asyncHandler(async (req , res,next)=>{
   const user =await User.findByIdAndUpdate(req.user._id , {active:false});
    if(!user) return next(new ApiError("User Not Found",404))
    res.status(204).json({
        status:"success",
        message:"User Deleted Successfully"
    });
});
