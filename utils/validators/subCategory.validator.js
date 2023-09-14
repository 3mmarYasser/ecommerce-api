const { check, body} = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");
const slugify = require("slugify");
exports.getSubCategoryByIdValidator = [
    check('id').isMongoId().withMessage("Invalid Sub Category ID Format"),
    validatorMiddleware
];

exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage("Sub Category Name is Required")
        .isLength({min:2 , max:32})
        .withMessage("Sub Category Name must be between 2 to 32 characters")
        .custom((value , {req})=>{
            req.body.slug = slugify(value);
            return true;
        }),
    check('category').notEmpty().withMessage("Sub Category must be belong to a Category").isMongoId().withMessage("Invalid Category Id"),
    validatorMiddleware
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Sub Category ID Format"),
    body('name').optional()
        .isLength({min:2 , max:32}).withMessage("Sub Category Name must be between 2 to 32 characters")
        .custom((value , {req})=>{
            req.body.slug = slugify(value);
            return true;
        })
    ,
    check('category').optional().isMongoId().withMessage("Invalid Category Id"),
    validatorMiddleware
];
exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Sub Category ID Format"),
    validatorMiddleware
];