const mongoose=require("mongoose");
const sampleListings = require("./data.js");
const Listing=require("../models/listing.js");




main().then(()=>{
    console.log("connected to DB")

}).catch((err)=>{
    console.log(err);
});



async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}


const initDB = async () => {
    // await Listing.deleteMany({});

  const sample = sampleListings.map((obj) => ({
    ...obj,
    owner: "6912cdbd8a4c4793c44f060a",
  }));

  await Listing.insertMany(sample);
  console.log("Data was initialized with owner field!");
};




  
  





initDB();
 

