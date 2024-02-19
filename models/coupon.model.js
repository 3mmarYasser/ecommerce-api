const mongoose = require('mongoose');
const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
        unique: true,
    },
    expire: {
        type: Date,
        required: [true, 'Expire Date is required'],
    },
    discount: {
        type: Number,
        required: [true, 'Discount is required'],
    },
});
module.exports = mongoose.model('Coupon', CouponSchema);