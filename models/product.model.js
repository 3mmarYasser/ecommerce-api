const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Please Enter Product Title"],
        trim:true,
        maxLength:[100,"Product Title Can't Exceed 100 Characters"],
        minLength:[3,"Product Title Must Be At Least 3 Characters"]
    },
    slug:{
        type:String,
        required:[true,"Please Enter Product Slug"],
        lowercase:true,
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"],
        minLength:[20,"Product Description Must Be At Least 20 Characters"]
    },
    quantity:{
        type:Number,
        required:[true,"Please Enter Product Quantity"],
    },
    sold:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        trim:true,
        max:[2_000_000_000,"Product Price Can't Exceed 20 Characters"],
    },
    priceDiscount:{
        type:Number,
        default:0
    },
    colors:[String],

    imageCover:{
      type:String,
      required:[true,"Please Enter Product Image Cover"],
    },
    images:[String],
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"Category",
        required:[true,"Please Enter Product Category"]
    },
    subCategory:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"SubCategory"
        }
    ],
    brand:{
        type:mongoose.Schema.ObjectId,
        ref:"Brand"
    },
    ratingsAverage:{
        type:Number,
        min:[1,"Rating Average Must Be At Least 1.0"],
        max:[5,"Rating Average Can't Exceed 5.0"],
    },
    ratingsQuantity:{
        type:Number,
        default:0

    }

},{timestamps:true});

module.exports = mongoose.model("Product",productSchema);