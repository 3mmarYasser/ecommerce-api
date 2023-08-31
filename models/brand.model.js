const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , "Brand Name is Required"],
        unique:[true , "Brand must be unique"],
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
module.exports = mongoose.model("Brand",BrandSchema);
