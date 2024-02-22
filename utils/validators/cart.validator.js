const {body ,param} = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");
const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");

exports.addProductToCartValidator = [
    body('product').isMongoId().withMessage('Invalid product id format').custom((val, {req}) => {
        return Product.exists({_id: val}).select("price colors").then(product => {
            if (!product) {
                throw new Error('Product not found');
            }else {
                req.product = product;
            }
        })
    })
    ,
    body('count').notEmpty().withMessage('Product count is required').isInt({ min: 1 }).withMessage('Product count must be at least 1'),
    body('color').optional().custom((val, {req}) => {
        if(!req.product.colors.includes(val)){
            throw new Error('Invalid color');
        }
        return true
    })
    ,
    validatorMiddleware
];
exports.deleteProductFromCartValidator = [
    param("productId").isMongoId().withMessage("Invalid product id format").custom((val, {req}) => {
        return Product.exists({_id: val}).select("price colors").then(product => {
            if (!product) {
                throw new Error('Product not found');
            }else {
                req.product = product;
            }
        })
    }),
    body('count').optional().isInt({ min: 1 }).withMessage('Product count must be at least 1'),
    validatorMiddleware
];