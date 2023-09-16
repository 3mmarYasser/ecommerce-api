const express =require("express");
const router = express.Router()
const {getCategoryByIdValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator} = require("../utils/validators/category.validator");
const {getCategories ,createCategory ,getCategoryById,updateCategory ,deleteCategory,uploadCategoryImage ,resizeCategoryImage}= require("../services/category.service");
const  subCategoryRoute  = require("./subCategory.route");


router.route("/")
    .get(getCategories)
    .post(uploadCategoryImage,resizeCategoryImage ,createCategoryValidator,createCategory);

router.route("/:id")
    .get(getCategoryByIdValidator, getCategoryById)
    .put(uploadCategoryImage,resizeCategoryImage ,updateCategoryValidator,updateCategory)
    .delete(deleteCategoryValidator,deleteCategory);

router.use("/:categoryId/subCategories",subCategoryRoute)

module.exports = router;
