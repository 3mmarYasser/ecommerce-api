const { check, body} = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");
const slugify = require("slugify");

exports.getCategoryByIdValidator = [
    check('id').isMongoId().withMessage("Invalid Category ID Format"),
    validatorMiddleware
];

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage("Category Name is Required")
        .isLength({min:3 , max:32}).withMessage("Category Name must be between 3 to 32 characters")
        .custom((value , {req})=>{
            req.body.slug = slugify(value);
            return true;
        }),
    validatorMiddleware
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Category ID Format"),
    body('name').optional().isLength({min:3 , max:32}).withMessage("Category Name must be between 3 to 32 characters")
        .custom((value , {req})=>{
            req.body.slug = slugify(value);
            return true;
        })

    ,
    validatorMiddleware
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Category ID Format"),
    validatorMiddleware
];