const SubCategory = require( "../models/subCategory.model")
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require("./../utils/apiError")

exports.createFilterObject = (req , res , next)=>{
    let filterObject ={};
    if(req.params.categoryId) filterObject = {category:req.params.categoryId}
    req.filterObject = filterObject;
    next();
}
exports.getSubCategories = asyncHandler(async (req, res)=>{
    const page= req.query.page * 1||1;
    const limit =req.query.limit *1 ||5;
    const skip = (page-1) * limit;

    const subCategories = await SubCategory
        .find(req.filterObject)
        .skip(skip)
        .limit(limit);
    res.status(200).json({results:subCategories.length ,page, data:subCategories});
})

exports.getSubCategoryById = asyncHandler(async (req , res,next )=>{
    const {id} = req.params;
    const subCategory = await SubCategory.findById(id);
    if(!subCategory) return next(new ApiError("Category Not Found" ,404))
    res.status(200).json({data:subCategory})

})
exports.setCategoryIdToBody = (req , res , next)=>{
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
}

exports.createSubCategory = asyncHandler(async (req , res)=>{

    const {name , category} = req.body;
    const subCategory =  await SubCategory.create({
        name,
        slug:slugify(name),
        category
    });
    res.status(201).json({data:subCategory})
});

exports.updateSubCategory = asyncHandler(async (req , res,next)=>{
    const {id} = req.params;
    const {name , category} = req.body;
    const subCategory = await SubCategory.findOneAndUpdate({_id:id},{
        name ,
        slug:slugify(name),
        category
    },{new:true})
    if(!subCategory) return next(new ApiError("Category Not Found" ,404))
    res.status(200).json({data:subCategory})
})

exports.deleteSuvbCategory = asyncHandler(async (req , res,next)=>{
    const {id} = req.params;
    const subCategory = await SubCategory.findByIdAndDelete(id)
    if(!subCategory) return next(new ApiError("Category Not Found" ,404))
    res.status(204).send()
})