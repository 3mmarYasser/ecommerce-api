const Coupon = require('../models/coupon.model');
const handlerFactory = require("./handlerFactory.service")

exports.getCoupons = handlerFactory.getAll(Coupon);
exports.getCoupon = handlerFactory.getOne(Coupon);
exports.createCoupon = handlerFactory.createOne(Coupon,[],["name","discount","expire"]);
exports.updateCoupon = handlerFactory.updateOne(Coupon,[],["name","discount","expire"]);
exports.deleteCoupon = handlerFactory.deleteOne(Coupon);