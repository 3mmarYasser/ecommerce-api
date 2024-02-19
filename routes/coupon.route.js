const express =require("express");
const router = express.Router()
const {createCoupon ,deleteCoupon,getCoupon,getCoupons,updateCoupon}= require("../services/coupon.service");
const {createCouponValidator,deleteCouponValidator,getCouponByIdValidator,updateCouponValidator} = require("../utils/validators/coupon.validator");
const AuthService = require("../services/auth.service");

router.use(
    AuthService.auth,
    AuthService.allowedTo("admin","manager")
);

router.route("/")
    .post(createCouponValidator,createCoupon)
    .get(getCoupons);

router.route("/:id")
    .get(getCouponByIdValidator, getCoupon)
    .put(updateCouponValidator,updateCoupon)
    .delete(deleteCouponValidator,deleteCoupon);
module.exports = router;
