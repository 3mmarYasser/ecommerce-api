const express =require("express");
const router = express.Router({mergeParams:true});
const {createSubCategoryValidator,getSubCategoryByIdValidator,updateSubCategoryValidator,deleteSubCategoryValidator} = require("../utils/validators/subCategory.validator");
const {createSubCategory ,getSubCategories ,getSubCategoryById ,updateSubCategory ,deleteSuvbCategory ,setCategoryIdToBody ,createFilterObject} = require("../services/subCategory.service");
router.route("/")
    .get(createFilterObject , getSubCategories)
    .post(setCategoryIdToBody , createSubCategoryValidator,createSubCategory);

router.route("/:id")
    .get(getSubCategoryByIdValidator,getSubCategoryById)
    .put(updateSubCategoryValidator,updateSubCategory)
    .delete(deleteSubCategoryValidator,deleteSuvbCategory);

module.exports = router;