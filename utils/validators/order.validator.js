const {  body} = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");

exports.createOrderValidator = [
    body('shippingAddress').notEmpty().withMessage('Shipping address is required').isObject().withMessage('Shipping address must be an object'),
    body('shippingAddress.address').notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required').isPostalCode('any').withMessage('Invalid postal code'),
    body('shippingAddress.country').notEmpty().withMessage('Country is required').isAlpha().withMessage('Invalid country name'),
    body('shippingAddress.phone').notEmpty().withMessage('Phone is required').isMobilePhone(["ar-EG","ar-SA","en-US"]).withMessage("Invalid Phone Number"),
    validatorMiddleware,
];