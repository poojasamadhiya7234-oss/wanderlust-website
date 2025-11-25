const listing=require("../models/listing.js");


module.exports.index=async (req,res)=>{
   
    const alllistings= await listing.find({});
    res.render("listings/index.ejs",{alllistings});

}




module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};





module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
   const listingdata=await listing.findById(id)
   .populate({
    path:"reviews",
    populate:{
        path:"author"
    },
    })
    .populate("owner");


   if(!listingdata){
    req.flash("error","Listing you requested for does not exit!");
     return res.redirect("/listings");
   }
   
   
res.render("listings/show.ejs",{listingdata})
};



module.exports.createListing=async (req,res)=>{
const newListing= new listing(req.body.listing);// to create new model model ke andar object pass kiya jo res.body me aaya new.ejs se listing object jisme sare  iski jagah destructuring bhi kr sakte listing object na bnate agar new.ejs me form me to
   if (req.file) {
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };
}


newListing.owner=req.user._id;



  await newListing.save();
  // console.log(listing);// listing object
  req.flash("success","new Listing created!");
   res.redirect("/listings");
 
};


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id);
    if(!Listing){
    req.flash("error","Listing you requested for does not exit!");
     return res.redirect("/listings");
   }
   let originalImageUrl=Listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{Listing,originalImageUrl})

};




// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;

//     let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

//     if (req.file) {
//         Listing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//         await Listing.save();
//     }

//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// };



module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let Listing = await listing.findById(id);

    if (!Listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        Listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await Listing.save();
    }

    req.flash("success", "Listing Updated!");
    return res.redirect(`/listings/${id}`);
};





// module.exports.destroyListing=async(req,res)=>{
//     //  if(!req.body.listing){
//     //     throw new ExpressError(400,"Send valid data for listing");
//     // }
//     let {id}=req.params;
//    await listing.findByIdAndDelete(id,{...req.body.listing})//listing object h edit.ejs ka
//    req.flash("success"," Listing Deleted!");
//   res.redirect(`/listings`);
// };



module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    await listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    return res.redirect("/listings");
};
