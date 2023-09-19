const handlerFactory = require("./handlerFactory.service")
const {uploadSingleImage} = require("../middlewares/upload.middleware");
const {v4:uuid4} = require("uuid");
const {dirExist} = require("../utils/dirExist");
const sharp = require("sharp");
const User = require('../models/user.model');

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
exports.getUsers = handlerFactory.getAll(User);

exports.getUserById = handlerFactory.getOne(User);

exports.createUser = handlerFactory.createOne(User);

exports.changeUserPassword = handlerFactory.updateOne(User,[],["password"]);

exports.updateUser =  handlerFactory.updateOne(User,["password","active"]);

exports.deleteUser = handlerFactory.deleteOne(User);