const { check, body} = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");
const slugify = require('slugify');


exports.getBrandByIdValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware
];

exports.createBrandValidator = [
    check('name').notEmpty().withMessage("Brand Name is Required")
        .isLength({min:3 , max:32}).withMessage("Brand Name must be between 3 to 32 characters")
        .custom((value , {req})=>{
            req.body.slug = slugify(value);
            return true;
        }),
    check('image').notEmpty().withMessage("Brand Image is Required")
        .custom((value)=>{
            if(value && ( value.endsWith(".png") || value.endsWith(".jpg") || value.endsWith(".jpeg"))){
                return true;
            }
            throw new Error("Invalid Image Format");
        }),
    validatorMiddleware
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    body('name').optional()
        .isLength({min:3 , max:32}).withMessage("Brand Name must be between 3 to 32 characters")
        .custom((value , {req})=>{
            req.body.slug = slugify(value);
            return true;
        }),
    check("image").optional().custom((value)=>{
        if(value && ( value.endsWith(".png") || value.endsWith(".jpg") || value.endsWith(".jpeg"))){
            return true;
        }
        throw new Error("Invalid Image Format");
    }),
    validatorMiddleware
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware
];