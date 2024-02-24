const mongoose = require('mongoose');
const ModelSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"Please Enter User"]
    },
    cartItems:[
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
    taxPrice:{
        type:Number,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        default:0.0
    },
    shippingAddress:{
        address:String,
        city:String,
        postalCode:String,
        phone:String,
        country:String
    },
    totalOrderPrice:Number,
    paymentMethod:{
        type:String,
        enum:["cash","card"],
        required:[true,"Please Enter Payment Method"]
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:Date,
    isDelivered:{
        type:Boolean,
        default:false
    },
    deliveredAt:Date

},{timestamps:true});

ModelSchema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"username email"
    }).populate({
        path:"cartItems.product",
        select:"title imageCover"
    })
    next();
})

module.exports = mongoose.model('Order', ModelSchema);

