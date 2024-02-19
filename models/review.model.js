const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    title:{
        type:String,
    },

    description:{
        type:String,
    },

    rating:{
        type:Number,
        min:[1,"Rating must be at least 1"],
        max:[5,"Rating must be at most 5"],
        required:[true,"Rating is required"]
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"User is required"]
    },

    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
        required:[true,"Product is required"]
    }

},{timestamps:true})
Schema.pre(/^find/,function (next,opts){
    this.populate({
        path:"user",
        select:"username"
    });
    next();
})
Schema.statics.calcAverageRatingsAndQuantity = async function (productId){
   const result = await this.aggregate([
       {$match:{product:productId}},
       {$group:{
           _id:"$product",
               ratingsAverage:{$avg:"$rating"},
               ratingsQuantity:{$sum:1}
       }
       }
   ])
    if(result.length >0){
        await this.model("Product").findByIdAndUpdate(productId,{
            ratingsAverage:result[0].ratingsAverage,
            ratingsQuantity:result[0].ratingsQuantity
        })
    }else {
        await this.model("Product").findByIdAndUpdate(productId,{
            ratingsAverage:0,
            ratingsQuantity:0
        })
    }
}
Schema.post("save",async function (){
    await this.constructor.calcAverageRatingsAndQuantity(this.product)
})
Schema.post('findOneAndDelete', async function (doc) {
    if(doc){
        const Review = mongoose.model('Review');
        await Review.calcAverageRatingsAndQuantity(doc.product);
    }
});

module.exports = mongoose.model("Review", Schema);