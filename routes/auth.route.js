const express =require("express");
const {signup,signin} = require("../services/auth.service");
const {signupValidator,signinValidator} = require("../utils/validators/auth.validator");
const router = express.Router();
router.route("/signup").post(signupValidator,signup);
router.route("/signin").post(signinValidator,signin);
module.exports = router;