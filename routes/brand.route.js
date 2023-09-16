const express =require("express");
const router = express.Router()
const {getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator} = require("../utils/validators/brand.validator");
const {getBrands ,getBrandById,updateBrand ,deleteBrand ,createBrand ,uploadBrandImage ,resizeBrandImage}= require("../services/brand.service");

router.route("/")
    .get(getBrands)
    .post(uploadBrandImage , resizeBrandImage,createBrandValidator,createBrand);

router.route("/:id")
    .get(getBrandByIdValidator, getBrandById)
    .put(uploadBrandImage , resizeBrandImage,updateBrandValidator,updateBrand)
    .delete(deleteBrandValidator,deleteBrand);


module.exports = router;
