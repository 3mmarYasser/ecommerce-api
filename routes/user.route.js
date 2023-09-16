const express =require("express");
const router = express.Router()
const {getUserByIdValidator, createUserValidator, updateUserValidator, deleteUserValidator} = require("../utils/validators/user.validator");
const {getUsers ,getUserById,updateUser ,deleteUser ,createUser ,uploadUserImage ,resizeUserImage}= require("../services/user.service");

router.route("/")
    .get(getUsers)
    .post(uploadUserImage , resizeUserImage ,createUserValidator,createUser);

router.route("/:id")
    .get(getUserByIdValidator, getUserById)
    .put(uploadUserImage , resizeUserImage,updateUserValidator,updateUser)
    .delete(deleteUserValidator,deleteUser);

module.exports = router;