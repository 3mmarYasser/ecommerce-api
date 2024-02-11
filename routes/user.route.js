const express =require("express");
const router = express.Router()
const {getUserByIdValidator, createUserValidator, updateUserValidator, deleteUserValidator,changeUserPasswordValidator} = require("../utils/validators/user.validator");
const {getLoggedUserData,updateLoggedUser,deleteLoggedUser,getUsers ,getUserById,updateUser ,deleteUser ,createUser ,uploadUserImage ,resizeUserImage ,changeLoggedUserPassword}= require("../services/user.service");
const AuthService = require("../services/auth.service");

router.use(AuthService.auth)
router.route("/me")
    .get(
        getLoggedUserData,
        getUserById
    )
    .put(
        getLoggedUserData,
        uploadUserImage,
        resizeUserImage,
        updateUserValidator,
        updateLoggedUser
    )

router.route("/change-my-password").put(
    getLoggedUserData,
    changeUserPasswordValidator,
    changeLoggedUserPassword
);
router.route("/delete-me").delete(
    deleteLoggedUser
);
router.use(
    AuthService.allowedTo("admin"))
router.route("/")
    .get(
        getUsers
    )
    .post(
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser);

router.route("/:id")
    .get(
        getUserByIdValidator,
        getUserById
    )
    .put(
        uploadUserImage,
        resizeUserImage,
        updateUserValidator,
        updateUser
    )
    .delete(
        deleteUserValidator,
        deleteUser
    );


module.exports = router;