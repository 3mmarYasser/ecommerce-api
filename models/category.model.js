const mongoose = require("mongoose")

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , "Category Name is Required"],
        unique:[true , "Category must be unique"],
        minlength:[3 , "Too Short"],
        maxlength:[32 , "Too Long"]
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:String
},{timestamps:true}
)

const CategoryModel = mongoose.model("Category",CategorySchema);
module.exports = CategoryModel