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
        unique:[true,"Product Slug Must Be Unique"],
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
    subCategories:[
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

},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

productSchema.pre(/^find/,function(next){
    this.populate({
        path:"category",
        select:"name"
    })
    next();
})
productSchema.virtual("reviews",{
    ref:"Review",
    foreignField:"product",
    localField:"_id"
})

module.exports = mongoose.model("Product",productSchema);