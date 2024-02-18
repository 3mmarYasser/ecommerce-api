const express =require("express");
const router = express.Router({mergeParams:true});
const {createFilterObject, setProductIdToBody,createReview ,deleteReview,getReviewById,getReviews,updateReview}= require("../services/review.service");
const {createReviewValidator,updateReviewValidator,getReviewByIdValidator,deleteReviewValidator} = require("../utils/validators/review.validator");

const AuthService = require("../services/auth.service");

router.route("/")
    .get(
        createFilterObject
        ,getReviews)
    .post(
        AuthService.auth,
        setProductIdToBody,
        createReviewValidator,
        createReview);
router.route("/:id")
    .get(
        getReviewByIdValidator,
        getReviewById
    )
    .put(
        AuthService.auth,
        AuthService.allowedTo("admin","user" , "manager"),
        updateReviewValidator,
        updateReview)
    .delete(AuthService.auth,
        AuthService.allowedTo("admin","user" , "manager"),
        deleteReviewValidator,
        deleteReview);
module.exports = router;
