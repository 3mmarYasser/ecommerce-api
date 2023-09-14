const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/apiError");
const ApiFeatures = require("./../utils/apiFeatures");

exports.deleteOne = Model => asyncHandler(async (req , res,next)=>{
    const {id} = req.params;
    const doc = await Model.findByIdAndDelete(id)
    if(!doc) return next(new ApiError(`${Model.modelName} Not Found` ,404))

    res.status(204).send()
})

exports.updateOne = Model => asyncHandler(async (req , res,next)=>{
    const {id} = req.params;
    const doc = await Model.findByIdAndUpdate(id,req.body,{new:true})

    if(!doc) return next(new ApiError(`${Model.modelName} Not Found` ,404))

    res.status(200).json({data:doc})
})

exports.createOne = Model => asyncHandler(async (req , res)=>{
    const doc =  await Model.create(req.body);
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