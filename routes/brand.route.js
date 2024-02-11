const express =require("express");
const router = express.Router()
const {getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator} = require("../utils/validators/brand.validator");
const {getBrands ,getBrandById,updateBrand ,deleteBrand ,createBrand ,uploadBrandImage ,resizeBrandImage}= require("../services/brand.service");
const AuthService = require("../services/auth.service");

router.route("/")
    .get(getBrands)
    .post(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        uploadBrandImage,
        resizeBrandImage,
        createBrandValidator,
        createBrand
    );

router.route("/:id")
    .get(getBrandByIdValidator, getBrandById)
    .put(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        uploadBrandImage,
        resizeBrandImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(
        AuthService.auth,
        AuthService.allowedTo("admin"),
        deleteBrandValidator,
        deleteBrand
    );


module.exports = router;
