const express =require("express");
const router = express.Router()
const {getUserByIdValidator, createUserValidator, updateUserValidator, deleteUserValidator,changeUserPasswordValidator} = require("../utils/validators/user.validator");
const {getUsers ,getUserById,updateUser ,deleteUser ,createUser ,uploadUserImage ,resizeUserImage ,changeUserPassword}= require("../services/user.service");

router.route("/")
    .get(getUsers)
    .post(uploadUserImage , resizeUserImage ,createUserValidator,createUser);

router.route("/:id")
    .get(getUserByIdValidator, getUserById)
    .put(uploadUserImage , resizeUserImage,updateUserValidator,updateUser)
    .delete(deleteUserValidator,deleteUser)
;
router.route("/change-password/:id").put(changeUserPasswordValidator,changeUserPassword);


module.exports = router;