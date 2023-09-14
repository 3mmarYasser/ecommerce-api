const Category = require( "../models/category.model")

const handlerFactory = require("./handlerFactory.service")

exports.getCategories = handlerFactory.getAll(Category)

exports.getCategoryById = handlerFactory.getOne(Category)

exports.createCategory = handlerFactory.createOne(Category)

exports.updateCategory = handlerFactory.updateOne(Category)

exports.deleteCategory = handlerFactory.deleteOne(Category)