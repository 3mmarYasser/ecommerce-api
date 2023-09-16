const express = require("express");
const router = express.Router();
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct,resizeProductImages ,uploadProductImages } = require("../services/product.service");
const { getProductByIdValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require("../utils/validators/product.validator");

router.route("/")
    .get(getProducts)
    .post(uploadProductImages,resizeProductImages,createProductValidator, createProduct);

router.route("/:id")
    .get(getProductByIdValidator, getProductById)
    .put(uploadProductImages,resizeProductImages,updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);

module.exports = router;