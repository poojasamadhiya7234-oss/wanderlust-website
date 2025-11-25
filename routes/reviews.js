const express=require("express");
const router=express.Router({mergeParams:true});



const listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
// const{ reviewSchema }=require("../schema.js");
const {validateReview, isLoggedIN, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");














//Post  Review route
router.post("/",isLoggedIN, wrapAsync(reviewController.createReview))


//Delete Review Route
router.delete("/:reviewId",isLoggedIN,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports=router;










