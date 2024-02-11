const express = require("express");
const router = express.Router();
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct,resizeProductImages ,uploadProductImages } = require("../services/product.service");
const { getProductByIdValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require("../utils/validators/product.validator");
const AuthService = require("../services/auth.service");

router.route("/")
    .get(getProducts)
    .post(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct);

router.route("/:id")
    .get(getProductByIdValidator, getProductById)
    .put(
        AuthService.auth,
        AuthService.allowedTo("admin" ,"manager"),
        uploadProductImages,
        resizeProductImages,
        updateProductValidator,
        updateProduct)
    .delete(
        AuthService.auth,
        AuthService.allowedTo("admin"),
        deleteProductValidator,
        deleteProduct
    );

module.exports = router;