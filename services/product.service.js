const Product = require("./../models/product.model");
const handlerFactory = require("./handlerFactory.service")
const sharp = require("sharp");
const {dirExist} = require("../utils/dirExist");
const {v4: uuidv4} = require("uuid");
const {uploadMixOfImages} = require("../middlewares/upload.middleware");


exports.uploadProductImages = uploadMixOfImages([
    {name:"imageCover" , maxCount:1},
    {name:"images" , maxCount:5}
]);
exports.resizeProductImages = async (req , res , next)=>{
    console.log(req.files)
    if(req.files?.imageCover){
        const dir = 'uploads/products';
        dirExist(dir)
        const fileName = `product-${uuidv4()}-${Date.now()}-cover.png`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000,1333)
            .toFormat("png")
            .png({quality:100})
            .toFile(`${dir}/${fileName}`);
        req.body.imageCover = "/"+dir.split("/")[1]+"/"+fileName;
    }
    if(req.files?.images){
        const dir = 'uploads/products';
        dirExist(dir)
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (file , i)=>{
            const fileName = `product-${uuidv4()}-${Date.now()}-${i+1}.png`;
            await sharp(file.buffer)
                .resize(800,800)
                .toFormat("png")
                .png({quality:100})
                .toFile(`${dir}/${fileName}`);
            req.body.images.push("/"+dir.split("/")[1]+"/"+fileName);
        })
        )
    }
    next()
}
exports.getProducts = handlerFactory.getAll(Product)

exports.getProductById = handlerFactory.getOne(Product,"reviews")

exports.createProduct = handlerFactory.createOne(Product)

exports.updateProduct = handlerFactory.updateOne(Product)

exports.deleteProduct = handlerFactory.deleteOne(Product)