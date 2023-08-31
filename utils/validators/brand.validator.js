const { check } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");

exports.getBrandByIdValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware
];

exports.createBrandValidator = [
    check('name').notEmpty().withMessage("Brand Name is Required")
        .isLength({min:3 , max:32}).withMessage("Brand Name must be between 3 to 32 characters"),
    validatorMiddleware
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    check('name').notEmpty().withMessage("Brand Name is Required").isLength({min:3 , max:32}).withMessage("Brand Name must be between 3 to 32 characters"),
    validatorMiddleware
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware
];