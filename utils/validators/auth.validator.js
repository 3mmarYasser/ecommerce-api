const {body} = require("express-validator");
const User = require("../../models/user.model");
const validatorMiddleware = require("../../middlewares/validator.middleware");

exports.signupValidator = [
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

    body("password").notEmpty().withMessage("Password is Required").isLength({min: 6}).withMessage("Password must be at least 6 characters")

    ,
    body("passwordConfirm").notEmpty().withMessage("Password Confirmation is Required").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Password Confirmation does not match Password");
        }
        return true;
    }),
    validatorMiddleware
]
exports.signinValidator =[
    body("username").notEmpty().withMessage("Username is Required")
        .isLength({min: 3}).withMessage("Username must be at least 3 characters"),

    body("password").notEmpty().withMessage("Password is Required")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters")
    ,
    validatorMiddleware
]