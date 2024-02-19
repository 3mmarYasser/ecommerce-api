const {body, param} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator.middleware");
const User = require("../../models/user.model");
exports.addProductValidator = [
    body("alias").notEmpty().withMessage("alias is required").custom((val, {req}) => {
        return User.findOne({_id: req.user._id, "addresses.alias": val}).then(address => {
            if (address) {
                 throw new Error("alias already exists")
            }
        })
    })
    ,
    body("details").notEmpty().withMessage("details is required"),
    body("phone").notEmpty().withMessage("phone number is required").isMobilePhone(["ar-EG","ar-SA","en-US"]).withMessage("Invalid Phone Number"),
    body("city").notEmpty().withMessage("city is required"),
    body("postalCode").notEmpty().withMessage("postalCode is required").isPostalCode("any").withMessage("Invalid postalCode"),
    validatorMiddleware,
]
exports.removeAddressValidator = [
    param('addressId').isMongoId().withMessage('Invalid addressId'),
    validatorMiddleware
]