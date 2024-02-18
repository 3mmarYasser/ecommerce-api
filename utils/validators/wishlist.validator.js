const {check, body, param} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const Product = require('../../models/product.model');

exports.addProductToWishlistValidator = [
    body('productId').isMongoId().withMessage('Invalid productId')
        .custom(async (val, {req}) => {
            return Product.exists({_id: val}).then(exist => {
                if (!exist) {
                   throw new Error('Product not found');
                }
            })
        })
    ,
    validatorMiddleware,
]
exports.removeProductFromWishlistValidator = [
    param('productId').isMongoId().withMessage('Invalid productId'),
    validatorMiddleware
]