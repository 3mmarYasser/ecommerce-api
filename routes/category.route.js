const express =require("express");
const {getCategories ,createCategory ,getCategoryById,updateCategory ,deleteCategory}= require("../services/category.service");

const router = express.Router()

router.route("/")
    .get(getCategories)
    .post(createCategory)

router.route("/:id")
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory)

module.exports = router;
