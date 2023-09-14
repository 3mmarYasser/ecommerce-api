const Brand = require('../models/brand.model');
const handlerFactory = require("./handlerFactory.service")

exports.getBrands = handlerFactory.getAll(Brand)

exports.getBrandById = handlerFactory.getOne(Brand)

exports.createBrand = handlerFactory.createOne(Brand)

exports.updateBrand = handlerFactory.updateOne(Brand)

exports.deleteBrand = handlerFactory.deleteOne(Brand)
