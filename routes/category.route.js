const express =require("express");
const router = express.Router()
const {getCategoryByIdValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator} = require("../utils/validators/category.validator");
const {getCategories ,createCategory ,getCategoryById,updateCategory ,deleteCategory,uploadCategoryImage ,resizeCategoryImage}= require("../services/category.service");
const  subCategoryRoute  = require("./subCategory.route");
const AuthService = require("../services/auth.service");


router.route("/")
    .get(getCategories)
    .post(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        uploadCategoryImage,
        resizeCategoryImage ,
        createCategoryValidator,
        createCategory);

router.route("/:id")
    .get(getCategoryByIdValidator, getCategoryById)
    .put(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        uploadCategoryImage,
        resizeCategoryImage ,
        updateCategoryValidator,
        updateCategory)

    .delete(
        AuthService.auth,
        AuthService.allowedTo("admin"),
        deleteCategoryValidator,
        deleteCategory);

router.use("/:categoryId/subCategories",subCategoryRoute)

module.exports = router;
