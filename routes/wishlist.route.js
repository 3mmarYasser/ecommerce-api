const express =require("express");
const router = express.Router();
const AuthService = require("../services/auth.service");
const {addProductToWishlist,removeProductFromCart,getWishlist}= require("../services/wishlist.service");
const {addProductToWishlistValidator,removeProductFromWishlistValidator} = require("../utils/validators/wishlist.validator");


router.use(AuthService.auth)

router.route("/").post(
    addProductToWishlistValidator,
    addProductToWishlist
).get(
    getWishlist
);
router.route("/:productId").delete(
    removeProductFromWishlistValidator,
    removeProductFromCart)

module.exports = router;