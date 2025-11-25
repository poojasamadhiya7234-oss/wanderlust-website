if(process.env.NODE_ENV!="production"){
  require('dotenv').config()  
}




const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const listing=require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const { render } = require("ejs");
// const{ listingSchema,reviewSchema }=require("./schema.js");
// const Review=require("./models/review.js");
const listingsroutes=require("./routes/listings.js")
const reviewsroutes=require("./routes/reviews.js")
const usersroutes=require("./routes/users.js")

// const session=require("express-session");
//  const MongoStore=require('connect-mongo')

const session = require("express-session");
const MongoStore = require("connect-mongo");



const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User=require("./models/user.js");






// mongodb://127.0.0.1:27017/wanderlust"
 const dburl=process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connected to DB")

}).catch((err)=>{
    console.log(err);
});



async function main(){
    await mongoose.connect(dburl)
}

app.engine( "ejs",ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))

// const store=MongoStore.create({
//     mongoUrl:dburl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600,
// });


// // store.on("error",()=>{
// //     console.log("ERROR IN MONGO SESSION STORE",err);
// // });


const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};


// const sessionOptions={
//      store,
//     secret:process.env.SECRET,
//     resave:false,
//     saveUninitialized:true
// };




// app.use(session(sessionOptions));


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    //console.log(req.locals.success); // ye ek array h to jab iski lenght  nhi hogi  aur success bhi nhi hoga to alert ka div  nhi dikhega  sabhi page per 
    res.locals.currUser=req.user;
    next();
});

//Demo User
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });

//     let registerUser=await User.register(fakeUser,"Helloworld");
//     res.send(registerUser);
// })



app.get("/",(req,res)=>{
   return res.redirect("/listings");
});

app.use("/listings",listingsroutes);
app.use("/listings/:id/reviews",reviewsroutes);
app.use("/",usersroutes);



app.use((req,res,next)=>{
    next(new ExpressError(404 ,"Page Not Found!"))
});



//Error Handling Middleware
// app.use((err,req,res,next)=>{
//     let{statusCode=500,message="Something went wrong!"}=err;
//   return res.status(statusCode).render("error.ejs",{err});
//     // res.status(statusCode).send(message);

// })



app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).render("error.ejs", { err });
});



app.listen(8080,()=>{
    console.log("server is listening to port 8080")
});



