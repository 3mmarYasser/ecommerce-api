const SubCategory = require( "../models/subCategory.model")
const handlerFactory = require("./handlerFactory.service")

exports.setCategoryIdToBody = (req , res , next)=>{
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
}

exports.createFilterObject = (req , res , next)=>{
    let filterObject ={};
    if(req.params.categoryId) filterObject = {category:req.params.categoryId}
    req.filterObject = filterObject;
    next();
}
exports.getSubCategories = handlerFactory.getAll(SubCategory)

exports.getSubCategoryById = handlerFactory.getOne(SubCategory)

exports.createSubCategory = handlerFactory.createOne(SubCategory)

exports.updateSubCategory = handlerFactory.updateOne(SubCategory)

exports.deleteSuvbCategory = handlerFactory.deleteOne(SubCategory)