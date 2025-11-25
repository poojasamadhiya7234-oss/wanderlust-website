const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User = require("./user.js");


const listingSchema=new mongoose.Schema({
    title:{
        type:String,
         required:true,
    },
    description:String,
    image:{
    url: String,
    filename:String,
},
 
   price:Number,
    location:String,
    country:String,
   reviews:[
    {
    type:Schema.Types.ObjectId,
    ref:"Review"},
   ],

   owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
   }
   


});






//mongoose middleware  ye automatically trigger ho jayega jese hi index.js me  listing me find by id and delete chalega poori  deleted listing ki janlkari ise de di jayegi  post middleware aur pre middleware vhi h ye
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;


