const { check } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subCategory.model");
exports.getProductByIdValidator = [
    check('id').isMongoId().withMessage("Invalid Product ID Format"),
    validatorMiddleware
];

exports.createProductValidator = [
    check('title').notEmpty().withMessage("Product Title is Required")
        .isLength({min:3 , max:100}).withMessage("Product Title must be between 3 to 100 characters"),

    check('description').notEmpty().withMessage("Product Description is Required")
        .isLength({min:20}).withMessage("Product Description must be at least 20 characters"),

    check('quantity').notEmpty().withMessage("Product Quantity is Required")
        .isNumeric().withMessage("Product Quantity Must Be A Number"),

    check('price').notEmpty().withMessage("Product Price is Required")
        .isNumeric().withMessage("Product Price Must Be A Number"),

    check("sold").optional().isNumeric().withMessage("Product Sold Must Be A Number"),

    check("priceDiscount").optional().isNumeric().withMessage("Product Price Discount Must Be A Number")
        .toFloat()
        .custom((value, {req})=>{
            if(value >= req.body.price){
                throw new Error("Product Price Discount Must Be Less Than Product Price");
            }
            return true;
        })
    ,

    check("colors").optional().isArray().withMessage("Product Colors Must Be An Array"),

    check("imageCover").notEmpty().withMessage("Product Image Cover is Required"),

    check("images").optional().isArray().withMessage("Product Images Must Be An Array"),

    check("category").notEmpty().withMessage("Product Category is Required")
        .isMongoId().withMessage("Invalid Category Id")
        .custom(async (value )=>{
            const category = await Category.findById(value);
            if(!category){
                throw new Error("Category Not Found");
            }
            return true;
        })
    ,

    check("subCategories").optional().isArray().withMessage("Product Sub Category Must Be An Array")
        .isMongoId().withMessage("Invalid Sub Category Id")
        .custom(async (value,{req})=>{
            const subCategories = await SubCategory.find({_id:{$exists:true ,$in:value}});
            if(subCategories.length !== value.length){
                throw new Error("Sub Category Not Found");
            }
            return true;
        })

    ,

    check("brand").optional().notEmpty().withMessage("Product Brand is Required")
        .isMongoId().withMessage("Invalid Brand Id"),

    check("ratingsAverage").optional().isNumeric().withMessage("Product Ratings Average Must Be A Number")
        .isLength({min:1 ,max:5}).withMessage("Product Ratings Average Must Be Between 1.0 to 5.0"),

    check("ratingsQuantity").optional().isNumeric().withMessage("Product Ratings Quantity Must Be A Number"),

    validatorMiddleware
];
exports.updateProductValidator = [
    check('id').isMongoId().withMessage("Invalid Product ID Format"),
    validatorMiddleware
];
exports.deleteProductValidator = [
    check('id').isMongoId().withMessage("Invalid Product ID Format"),
    validatorMiddleware
];