const express =require("express");
const router = express.Router();
const AuthService = require("../services/auth.service");
const {addAddress ,removeAddress,getAllAddresses}= require("../services/address.service");
const {addProductValidator,removeAddressValidator} = require("../utils/validators/address.validator");


router.use(AuthService.auth)

router.route("/").post(
    addProductValidator,
    addAddress
).get(
    getAllAddresses
);
router.route("/:addressId").delete(
    removeAddressValidator,
    removeAddress)

module.exports = router;