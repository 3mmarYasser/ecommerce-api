const { param, body} = require('express-validator');
const validatorMiddleware = require("../../middlewares/validator.middleware");
const Coupon = require("../../models/coupon.model");

exports.getCouponByIdValidator = [
    param('id').isMongoId().withMessage('Invalid coupon id format'),
    validatorMiddleware,
];
exports.createCouponValidator = [
    body('name').notEmpty().withMessage('Coupon name is required').custom((val) => {
        return Coupon.exists({ name: val }).then(coupon => {
            if (coupon) {
                throw new Error('Coupon already exists');
            }
        });
    })
    ,
    body('discount').notEmpty().withMessage('Coupon discount is required').isFloat({ min: 1, max: 100 }).withMessage('Discount must be between 1 to 100')
    ,
    body('expire').notEmpty().withMessage('Coupon expire date is required').isISO8601().toDate().withMessage('Invalid date format'),
    validatorMiddleware,
];
exports.updateCouponValidator = [
    param('id').isMongoId().withMessage('Invalid coupon id format'),
    body('name').optional().notEmpty().withMessage('Coupon name is required'),
    body('discount').optional().notEmpty().withMessage('Coupon discount is required').isFloat({ min: 1, max: 100 }).withMessage('Discount must be between 1 to 100'),
    body('expire').optional().notEmpty().withMessage('Coupon expire date is required').isISO8601().toDate().withMessage('Invalid date format'),
    validatorMiddleware,
];
exports.deleteCouponValidator = [
    param('id').isMongoId().withMessage('Invalid coupon id format'),
    validatorMiddleware,
];
