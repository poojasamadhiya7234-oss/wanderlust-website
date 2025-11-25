const express=require("express");
const router=express.Router();





const listing=require("../models/listing.js");



 const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");

// const{ listingSchema,}=require("../schema.js");
const { isLoggedIN,isOwner,validateListing } = require("../middleware.js");


const listingController=require("../controllers/listings.js");


const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })



















router.route("/")
//Index Route
.get(wrapAsync(listingController.index) )

//Create Route
.post(isLoggedIN,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing) 

// .post(upload.single("listing[image]",(req,res)=>{res.send(req.file)}))

)


//New Route
router.get("/new", isLoggedIN,listingController.renderNewForm);


router.route("/:id")
//Show Route
.get(wrapAsync(listingController.showListing))

// Update Route
.put(isLoggedIN,isOwner,validateListing,upload.single("listing[image]"),wrapAsync(listingController.updateListing))

//Delete Route
.delete(isLoggedIN,isOwner,wrapAsync(listingController.destroyListing));




//Edit Route
router.get("/:id/edit",isLoggedIN,isOwner, wrapAsync(listingController.renderEditForm))





module.exports=router;


