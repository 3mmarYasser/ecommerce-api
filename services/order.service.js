const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/apiError");
const {} = require("../utils/dealWithObj");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const handlerFactory = require("./handlerFactory.service")

exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    const cart = await Cart.findOne({ orderedBy: req.user._id });
    if(!cart) return next(new ApiError("Cart not found", 404));
    if(cart.appliedCoupon && new Date(cart.appliedCoupon.expire).getTime() < Date.now()){
        cart.totalAfterDiscount = undefined;
        cart.appliedCoupon = undefined;
        await cart.save();
        return next(new ApiError("Coupon expired", 400));
    }
    const cartTotal = (cart.totalAfterDiscount || cart.cartTotal)+taxPrice+shippingPrice;
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.products,
        taxPrice,
        shippingPrice,
        totalOrderPrice: cartTotal,
        paymentMethod: "cash",
        shippingAddress: req.body.shippingAddress
    });
    if(order){
        const bultOpt = cart.products.map(p=>({
            updateOne: {
                filter: {_id: p.product},
                update: {$inc: {quantity: -p.count, sold: +p.count}}
            }
        }));
        await Product.bulkWrite(bultOpt, {});
        await Cart.findByIdAndDelete(cart._id);
    }
    res.status(201).json({
        status: "success",
        data: {
            data: order
        }
    });
})
exports.filterOrderLoggedUser = asyncHandler(async (req, res, next) => {
    req.filterObject = {user: req.user._id};
    next();
})
exports.findAllOrders = handlerFactory.getAll(Order);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        isPaid: true,
        paidAt: Date.now()
    }, {new: true});
    if(!order) return next(new ApiError("Order not found", 404));
    res.status(200).json({
        status: "success",
        data: {
            data: order
        }
    });
});
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        isDelivered: true,
        deliveredAt: Date.now()
    }, {new: true});
    if(!order) return next(new ApiError("Order not found", 404));
    res.status(200).json({
        status: "success",
        data: {
            data: order
        }
    });
});
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    const cart = await Cart.findOne({ orderedBy: req.user._id }).populate("products.product", "title imageCover");
    if(!cart) return next(new ApiError("Cart not found", 404));
    if(cart.appliedCoupon && new Date(cart.appliedCoupon.expire).getTime() < Date.now()){
        cart.totalAfterDiscount = undefined;
        cart.appliedCoupon = undefined;
        await cart.save();
        return next(new ApiError("Coupon expired", 400));
    }
    const cartTotal = (cart.totalAfterDiscount || cart.cartTotal)+taxPrice+shippingPrice;
    const session = await stripe.checkout.sessions.create({
        line_items: [
            ...cart.products.map(p=>({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: p.product.title,
                        images: [`${p.product.imageCover}`]
                    },
                    unit_amount: p.price*100
                },
                quantity: p.count
            })),
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: shippingPrice*100
                },
                quantity: 1
            },
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Tax"
                    },
                    unit_amount: taxPrice*100
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/order/my`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id,
        metadata: req.body.shippingAddress,
    })
    res.status(200).json({
        status: "success",
        data: {
            data: session
        }
    });
})