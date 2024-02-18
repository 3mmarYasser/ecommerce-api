const Review = require('../models/review.model');
const handlerFactory = require("./handlerFactory.service")
exports.setProductIdToBody = (req , res , next)=>{
    if(!req.body.product) req.body.product = req.params.productId;
    next();
}

exports.createFilterObject = (req , res , next)=>{
    let filterObject ={};
    if(req.params.productId) filterObject = {product:req.params.productId}
    console.log(req.params.productId)

    req.filterObject = filterObject;
    next();
}

exports.getReviews = handlerFactory.getAll(Review)
exports.getReviewById = handlerFactory.getOne(Review)
exports.createReview = handlerFactory.createOne(Review)
exports.updateReview = handlerFactory.updateOne(Review,[],["title","description","rating"])
exports.deleteReview = handlerFactory.deleteOne(Review)

