const {body, param} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const User = require('../../models/user.model');
const bcrypt = require("bcryptjs");

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

    body("password").notEmpty().withMessage("Password is Required").isLength({min: 6}).withMessage("Password must be at least 6 characters")

    ,
    body("passwordConfirm").notEmpty().withMessage("Password Confirmation is Required").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Password Confirmation does not match Password");
        }
        return true;
    }),

    body("phone").optional().isMobilePhone(["ar-EG","ar-SA","en-US"]).withMessage("Invalid Phone Number"),

    body("profileImage").optional(),
    validatorMiddleware
]
exports.updateUserValidator = [
    param("id").isMongoId().withMessage("Invalid User ID Format"),
    body("phone").optional().isMobilePhone(["ar-EG","ar-SA","en-US"]).withMessage("Invalid Phone Number"),
    body("email").optional().isEmail().withMessage("Invalid Email Format"),
    validatorMiddleware
]
exports.changeUserPasswordValidator = [
    param("id").isMongoId().withMessage("Invalid User ID Format").custom((value,{req})=>{

        return true;
    }),

    body("currentPassword").notEmpty().withMessage("Current Password is Required")
        .custom(async (value, {req}) => {
            const user = await User.findById(req.params.id);
            if(!user) return Promise.reject("User Not Found");
            const isMatch = await bcrypt.compare(value, user.password);
            if(!isMatch) return Promise.reject("Current Password is Incorrect");
            return true
        }),

    body("password").notEmpty().withMessage("Password is Required")
        .isLength({min: 6}).withMessage("Password must be at least 6 characters"),

    body("passwordConfirm").notEmpty().withMessage("Password Confirmation is Required")
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Password Confirmation does not match Password");
            }
            return true;
        }),
    validatorMiddleware
]
exports.deleteUserValidator = [
    param("id").isMongoId().withMessage("Invalid User ID Format"),
    validatorMiddleware
]