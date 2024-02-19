const asyncHandler = require("express-async-handler");
const User = require('../models/user.model');

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {$addToSet: {wishlist: req.body.productId}},
        {new:true})

    res.status(200).json({
        status:"success",
        message:"Product Added To Wishlist",
        data:user.wishlist
    })

})
exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        {$pull: {wishlist: req.params.productId}},
        {new:true})

    res.status(200).json({
        status:"success",
        message:"Product Removed From Wishlist",
        data:user.wishlist
    })
})
exports.getWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('wishlist')
    res.status(200).json({
        status:"success",
        results:user.wishlist.length,
        data:user.wishlist
    })
})