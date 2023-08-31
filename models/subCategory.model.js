const mongoose = require("mongoose")

const subCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true , "Sub Category Name is Required"],
        unique:[true , "Sub Category must be unique"],
        minlength:[2 , "Too Short Sub Category Name"],
        maxLength:[32 , "Too Long Sub Category Name"]
    },
    slug:{
        type:String,
        lowercase:true
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"Category",
        required: [true , "Sub Category must be belong to a Category"]
    }

},{timestamps:true})


module.exports = mongoose.model("SubCategory",subCategorySchema);