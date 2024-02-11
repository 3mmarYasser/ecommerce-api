const express =require("express");
const router = express.Router({mergeParams:true});
const {createSubCategoryValidator,getSubCategoryByIdValidator,updateSubCategoryValidator,deleteSubCategoryValidator} = require("../utils/validators/subCategory.validator");
const {createSubCategory ,getSubCategories ,getSubCategoryById ,updateSubCategory ,deleteSuvbCategory ,setCategoryIdToBody ,createFilterObject} = require("../services/subCategory.service");
const AuthService = require("../services/auth.service");

router.route("/")
    .get(createFilterObject , getSubCategories)
    .post(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        setCategoryIdToBody ,
        createSubCategoryValidator,
        createSubCategory);

router.route("/:id")
    .get(getSubCategoryByIdValidator,getSubCategoryById)
    .put(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        AuthService.auth,
        AuthService.allowedTo("admin"),
        deleteSubCategoryValidator,
        deleteSuvbCategory
    );

module.exports = router;