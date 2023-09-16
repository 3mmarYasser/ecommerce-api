const Category = require( "../models/category.model")
const handlerFactory = require("./handlerFactory.service")
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage} = require("../middlewares/upload.middleware");
const {dirExist} = require("../utils/dirExist");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeCategoryImage = async (req , res , next)=>{
    if(req.file){
        const dir = 'uploads/categories';
        dirExist(dir)
        const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(600,600)
            .toFormat("jpeg")
            .jpeg({quality:100})
            .toFile(`${dir}/${fileName}`);
        req.body.image = dir.split("/")[1]+"/"+fileName;
    }
    next();
}

exports.getCategories = handlerFactory.getAll(Category)

exports.getCategoryById = handlerFactory.getOne(Category)

exports.createCategory = handlerFactory.createOne(Category)

exports.updateCategory = handlerFactory.updateOne(Category)

exports.deleteCategory = handlerFactory.deleteOne(Category)