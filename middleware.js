
const listing=require("./models/listing");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");

const{ listingSchema,reviewSchema}=require("./schema.js");



module.exports.isLoggedIN=(req,res,next)=>{
     if(!req.isAuthenticated()){
           req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!")
         return res.redirect("/login");
    }
next();
}
//isLoggedIN ek function bnaya h 



module.exports.saveRedirectUrl=(req,res,next)=>{
     if(req.session.redirectUrl){
          res.locals.redirectUrl=req.session.redirectUrl
     }
     next();
}



// module.exports.isOwner=async(req,res,next)=>{
//      let {id}=req.params;
//      let listingauthorization=await listing.findById(id);
//       if(!listingauthorization.owner.equals(res.locals.currUser._id)){
//          req.flash("error"," you are not the owner of this listing!");
//          return  res.redirect(`/listings/${id}`);  
//       }
//   next();
// }



module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listingauthorization = await listing.findById(id);

    // 🔥 सबसे IMPORTANT: listing exist ही न हो, तो yahi return karo
    if (!listingauthorization) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // 🔥 अब owner check karo
    if (!listingauthorization.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};



module.exports.validateListing=(req,res,next)=>{
    let {error}=  listingSchema.validate(req.body);
  

if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
} else{
 next();
}

};



module.exports.validateReview=(req,res,next)=>{
    let {error}=  reviewSchema.validate(req.body);
  

if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
} else{
 next();
}


};




module.exports.isReviewAuthor=async(req,res,next)=>{
     let { id,reviewId}=req.params;
     let review=await Review.findById(reviewId);
     if(!review.author.equals(res.locals.currUser._id)){
          req.flash("error","you are not the author of this review")
          return res.redirect(`/listings/${id}`)
     }
     next();
}


  