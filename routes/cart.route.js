const express =require("express");
const router = express.Router()
const {addProductToCart,getCart,removeProductFromCart,clearCart,applyCoupon}= require("../services/cart.service");
const {addProductToCartValidator,deleteProductFromCartValidator} = require("../utils/validators/cart.validator");
const AuthService = require("../services/auth.service");

router.use(
    AuthService.auth,
);
router.route("/")
    .get(getCart)
    .post(
    addProductToCartValidator,
    addProductToCart
).delete(
    clearCart
);
router.route("/:productId")
    .delete(
        deleteProductFromCartValidator,
        removeProductFromCart
);
router.put("/apply-coupon",applyCoupon);
module.exports = router;