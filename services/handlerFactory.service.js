const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/apiError");
const ApiFeatures = require("./../utils/apiFeatures");
const {excludeProps, includeProps} = require("../utils/dealWithObj");

exports.deleteOne = (Model,additionalRes=(req,res,next)=>{return {}}) => asyncHandler(async (req , res,next)=>{
    const {id} = req.params;
    const doc = await Model.findByIdAndDelete(id)
    if(!doc) return next(new ApiError(`${Model.modelName} Not Found` ,404))
    doc.deleteOne();
    res.status(204).json({message:`${Model.modelName} Deleted Successfully`
        , ...(additionalRes(req, res, next))})
})

exports.updateOne = (Model,excludedProps=[],includedProps=[],additionalRes=(req,res,next)=>{return {}}) => asyncHandler(async (req , res,next)=>{
    const {id} = req.params;
    let body = excludeProps(req.body,excludedProps) // exclude some props from req.body

    body = includeProps(body,includedProps) // include some props from req.body

    const doc = await Model.findByIdAndUpdate(id,body,{new:true})

    if(!doc) return next(new ApiError(`${Model.modelName} Not Found` ,404))
    await doc.save();
    res.status(200).json({data:doc , ...(additionalRes(req,res,next))})
})

exports.createOne = (Model,excludedProps=[],includedProps=[]) => asyncHandler(async (req , res)=>{
    let body = excludeProps(req.body,excludedProps) // exclude some props from req.body
     body = includeProps(body,includedProps) // include some props from req.body
    const doc =  await Model.create(body);
    res.status(201).json({data:doc})
})

exports.getOne = (Model,popOptions) => asyncHandler(async (req , res,next)=>{
    let query = Model.findById(req.params.id)
    if(popOptions) query = query.populate(popOptions)
    const doc = await query
    if(!doc) return next(new ApiError(`${Model.modelName} Not Found` ,404))

    res.status(200).json({data:doc})
})

exports.getAll = (Model,popOptions,searchFields) => asyncHandler(async (req , res)=>{
    let filterObj ={};
    if(req.filterObject) filterObj = req.filterObject;
    console.log(filterObj)
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filterObj), req.query)
        .paginate(documentsCounts)
        .filter()
        .sort()
        .limitFields()
        .search(searchFields);

    const {mongooseQuery ,paginationResult} =apiFeatures;
    if(popOptions) mongooseQuery.populate(popOptions)
    const docs = await mongooseQuery;

    res.status(200).json({results:docs.length ,paginationResult, data:docs});
})