const { check, body} = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");
const slugify = require('slugify');
const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
const {Error} = require("mongoose");

exports.getReviewByIdValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format"),
    validatorMiddleware
];

exports.createReviewValidator = [
    body('title').optional(),
    body('description').optional(),
    body('rating').notEmpty().withMessage("Rating is required").isFloat({min:1, max:5}).withMessage("Rating must be between 1 to 5"),
    body('product')
        .isMongoId()
        .withMessage("Invalid Product ID Format")
        .custom( (value, {req})=>{
            return  User.exists({_id:req.user._id}).then(exists=>{
                if(!exists){
                    throw new Error("User not found");
                }
                req.body.user = req.user._id;
            });
        })
        .custom( (value, {req})=>{
            return  Product.exists({_id:value}).then(exists=>{
                if(!exists){
                    throw new Error("Product not found");
                }
            });
        })
        .custom( (value, {req})=>{
           return  Review.exists({product:value, user:req.body.user}).then(exists=>{
                if(exists){
                    throw new Error("You already reviewed this product");
                }
            });
        })
      ,

    validatorMiddleware
]

exports.updateReviewValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format")
        .custom(  (value, {req})=>{
            return Review.exists({_id:value , user:req.user._id}).then(exists=>{
                if(!exists){
                    throw new Error("Review may not found or you don't have the permissions to update it");
                }
            })
        })
    ,
    check('title').optional(),
    check('description').optional(),
    check('rating').optional().isFloat({min:1, max:5}).withMessage("Rating must be between 1 to 5"),
    validatorMiddleware
]

exports.deleteReviewValidator = [
    check('id').isMongoId().withMessage("Invalid Brand ID Format")
        .custom(  (value, {req})=>{
            if (req.user.role === 'user') {
               return  Review.exists({_id:value , user:req.user._id}).then(exists=>{
                    if(!exists){
                        throw new Error("Review may not found or you don't have the permissions to delete it");
                    }
                })
            }
            return true;
        })
    ,
    validatorMiddleware
];