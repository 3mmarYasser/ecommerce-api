const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart.model");
const Coupon = require('../models/coupon.model');
const {includeProps} = require("../utils/dealWithObj");
const ApiError = require("./../utils/apiError");

exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const body = includeProps(req.body, ["product", "count", "color"]);
    const cart = await Cart.findOne({ orderedBy: req.user._id });
    const product =req.product;
    if(!cart){
        const newCart = await Cart.create({
            products: [{ product: body.product, count: Number(body.count), price: product.price,color: body.color }],
            cartTotal: Number(body.count) * product.price,
            orderedBy: req.user._id
        });
        return res.status(201).json({
            status: "success",
            data: {
                data: newCart
            }
        });
    }else {
        const productExist = cart.products.find(p => (p.product.toString() === body.product&& p.color === body.color));
        if(productExist){
            productExist.count += Number(body.count);
        }else {
            cart.products.push({ product: body.product, count:Number(body.count), price: product.price,color: body.color });
        }
        cart.cartTotal += Number(body.count) * product.price;
        cart.totalAfterDiscount = undefined;
        cart.appliedCoupon = undefined;
        await cart.save();
        return res.status(201).json({
            status: "success",
            data: {
                data: cart
            }
        });
    }

});
exports.getCart = asyncHandler(async (req, res,next) => {
    const cart = await Cart.findOne({ orderedBy: req.user._id }).populate("appliedCoupon", "-_id name expire discount");
    if(!cart) return next(new ApiError("Cart not found", 404));
    const additionalData = {};
    if(cart.appliedCoupon?.expire && new Date(cart.appliedCoupon?.expire).getTime() < Date.now()){
        cart.totalAfterDiscount = undefined;
        cart.appliedCoupon = undefined;
        await cart.save();
        additionalData.message = "Coupon expired";
    }
    cart.appliedCoupon.expire = undefined;
    return res.status(200).json({
        status: "success",
        ...additionalData,
        data: {
            data: cart
        }
    });
});

exports.removeProductFromCart = asyncHandler(async (req, res,next) => {
    const body = includeProps(req.body, ["count", "color"]);
    if(!body.count) body.count = 1;
    const cart = await Cart.findOne({ orderedBy: req.user._id });
    const product =req.product;
    const productExist = cart.products.find(p => (p.product.toString() === product._id.toString() && p.color === body.color));
    if(!productExist) return next(new ApiError("Product not found in the cart",404));
    else {
        if(productExist.count < body.count) return next(new ApiError("Product count in the cart is less than the count you want to remove",400));
        else if(productExist.count === Number(body.count)){
            cart.cartTotal -= productExist.price *productExist.count;
            cart.products = cart.products.pull(productExist);

        }else if(productExist.count > body.count){
            productExist.count -= body.count;
            cart.cartTotal -= body.count * product.price;
        }
        cart.totalAfterDiscount = undefined;
        cart.appliedCoupon = undefined;
        await cart.save();
        return res.status(200).json({
            status: "success",
            data: {
                data: cart
            }
        });
    }
});
exports.clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndDelete({ orderedBy: req.user._id });
    return res.status(204).json({
        status: "success",
        data: null
    });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findOne({
        name: req.body.coupon ,
        expire: { $gte: Date.now() }
    });
    if(!coupon) return next(new ApiError("Invalid coupon", 400));
    const cart = await Cart.findOne({ orderedBy: req.user._id});
    cart.totalAfterDiscount = cart.cartTotal - (cart.cartTotal * (coupon.discount / 100));
    cart.appliedCoupon = coupon._id;
    await cart.save();
    return res.status(200).json({
        status: "success",
        data: {
            data: cart
        }
    });
})