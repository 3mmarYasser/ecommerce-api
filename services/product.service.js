const Product = require("./../models/product.model");
const handlerFactory = require("./handlerFactory.service")

exports.getProducts = handlerFactory.getAll(Product)

exports.getProductById = handlerFactory.getOne(Product)

exports.createProduct = handlerFactory.createOne(Product)

exports.updateProduct = handlerFactory.updateOne(Product)

exports.deleteProduct = handlerFactory.deleteOne(Product)