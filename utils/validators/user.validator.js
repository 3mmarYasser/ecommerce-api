const {check, body, param} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const User = require('../../models/user.model');

exports.getUserByIdValidator = [
    param("id").isMongoId().withMessage("Invalid User ID Format"),
    validatorMiddleware
]
exports.createUserValidator = [
    body("username").notEmpty().withMessage("Username is Required")
        .isLength({min: 3}).withMessage("Username must be at least 3 characters")
        .custom(async (value) => {
            const username = await User.findOne({username: value});
            if(username){
                return Promise.reject("Username already exists");
            }
        })
    ,
    body("email").notEmpty().withMessage("Email is Required").isEmail().withMessage("Invalid Email Format")

        .custom(async (value) => {
            const email = await User.findOne({email: value});
            if(email){
                return Promise.reject("Email already exists");
            }
        }),

    body("password").notEmpty().withMessage("Password is Required"),

    body("phone").optional().isMobilePhone(["ar-EG","ar-SA","en-US"]).withMessage("Invalid Phone Number"),

    body("profileImage").optional(),
    validatorMiddleware
]
exports.updateUserValidator = [
    param("id").isMongoId().withMessage("Invalid User ID Format"),
    validatorMiddleware
]
exports.deleteUserValidator = [
    param("id").isMongoId().withMessage("Invalid User ID Format"),
    validatorMiddleware
]