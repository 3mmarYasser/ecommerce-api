const multer = require("multer");
const ApiError = require("../utils/apiError");

const ImageMulterOptions = () => {
    const storage = multer.memoryStorage();
    const fileFilter = (req ,file,cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        }else {
            cb(new ApiError("Only Image Allowed",400) , false)
        }
    }
    return multer({storage ,fileFilter});
}

exports.uploadSingleImage = (fieldName="image") => ImageMulterOptions().single(fieldName);

exports.uploadMixOfImages = (fields=[]) => ImageMulterOptions().fields(fields);