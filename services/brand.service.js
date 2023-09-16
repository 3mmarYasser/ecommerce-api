const Brand = require('../models/brand.model');
const handlerFactory = require("./handlerFactory.service")
const {uploadSingleImage} = require("../middlewares/upload.middleware");
const {v4: uuidv4} = require("uuid");
const sharp = require("sharp");
const {dirExist} = require("../utils/dirExist");


exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage = async (req , res , next)=>{
    if(req.file){
        const dir = 'uploads/brands';
        dirExist(dir)
        const fileName = `brand-${uuidv4()}-${Date.now()}.png`;
        await sharp(req.file.buffer)
            .resize(400,400)
            .toFormat("png")
            .png({quality:95})
            .toFile(`${dir}/${fileName}`);
        req.body.image = "/"+dir.split("/")[1]+"/"+fileName;
    }
    next();
}

exports.getBrands = handlerFactory.getAll(Brand)

exports.getBrandById = handlerFactory.getOne(Brand)

exports.createBrand = handlerFactory.createOne(Brand)

exports.updateBrand = handlerFactory.updateOne(Brand)

exports.deleteBrand = handlerFactory.deleteOne(Brand)
