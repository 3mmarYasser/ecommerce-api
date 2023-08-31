const express =require("express");
const router = express.Router()
const {getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator} = require("../utils/validators/brand.validator");
const {getBrands ,getBrandById,updateBrand ,deleteBrand ,createBrand}= require("../services/brand.service");

router.route("/")
    .get(getBrands)
    .post(createBrandValidator,createBrand);

router.route("/:id")
    .get(getBrandByIdValidator, getBrandById)
    .put(updateBrandValidator,updateBrand)
    .delete(deleteBrandValidator,deleteBrand);


module.exports = router;
