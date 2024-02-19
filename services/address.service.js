const asyncHandler = require("express-async-handler");
const User = require('../models/user.model');
const {includeProps} = require("../utils/dealWithObj");

exports.addAddress = asyncHandler(async (req, res, next) => {
    const body = includeProps(req.body,["alias","details","phone","city","postalCode"]);
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {addresses:body}
    },{new:true})

    res.status(201).json({
        status: 'success',
        message: 'Address added successfully',
        data: user.addresses
    });
});
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: {addresses: {_id: req.params.addressId}}
    })

    res.status(204).json({
        status: 'success',
        message: 'Address removed successfully',
        data: user.addresses
    });
});
exports.getAllAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('addresses -_id')
    console.log(user)
    res.status(200).json({
        status: 'success',
        results: user.addresses.length,
        data: user.addresses
    });
})