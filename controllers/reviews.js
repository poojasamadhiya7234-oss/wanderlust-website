const listing=require("../models/listing.js");
const Review=require("../models/review.js");


module.exports.createReview=async (req, res) => {
  // ✅ Model का सही नाम "listing" (छोटे l से)
  const listingData = await listing.findById(req.params.id);

  // अगर listing नहीं मिली
  if (!listingData) {
    throw new ExpressError(404, "Listing not found");
  }

  // ✅ नया review बनाओ
  const newReview = new Review(req.body.review);
  // review ke author add kro 
  newReview.author=req.user._id;
  console.log(newReview);

  // ✅ listing की reviews array में add करो
  listingData.reviews.push(newReview);

  // ✅ पहले review save करो फिर listing
  await newReview.save();
  await listingData.save();

//   console.log("New Review:", newReview);
// console.log("Listing after push:", listingData);
// res.send("saved")
req.flash("success","new Review created!");

// ✅ Redirect वापस show page पर
  res.redirect(`/listings/${listingData._id}`);  
};


module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");

    res.redirect(`/listings/${id}`);
};