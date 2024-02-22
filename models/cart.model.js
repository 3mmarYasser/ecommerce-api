const mongoose = require('mongoose');
const CartSchema =new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            price: Number,
            count: Number,
            color: String,
        },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    appliedCoupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }
},{timestamps:true});
module.exports = mongoose.model('Cart', CartSchema);