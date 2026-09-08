if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const listingsroutes = require("./routes/listings.js");
const reviewsroutes = require("./routes/reviews.js");
const usersroutes = require("./routes/users.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user.js");


// MongoDB URL
const dburl = process.env.ATLASDB_URL;


// Database connection
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(dburl);
}


// EJS Mate setup
app.engine("ejs", ejsMate);


// View engine setup
app.set("view engine", "ejs");


// Views folder path
app.set("views", path.join(__dirname, "views"));


// Form data read karne ke liye
app.use(express.urlencoded({extended: true}));


// PUT aur DELETE request ke liye
app.use(methodOverride("_method"));


// Static files ke liye
app.use(express.static(path.join(__dirname, "/public")));


// MongoDB session store
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    touchAfter: 24 * 3600
});


// Mongo session error handle
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});


// Session options
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


// Session middleware
app.use(session(sessionOptions));


// Flash middleware
app.use(flash());


// Passport initialize
app.use(passport.initialize());


// Passport session
app.use(passport.session());


// Local Strategy
passport.use(new LocalStrategy(User.authenticate()));


// User serialize
passport.serializeUser(User.serializeUser());


// User deserialize
passport.deserializeUser(User.deserializeUser());


// IMPORTANT MIDDLEWARE
app.use((req, res, next) => {

    console.log("Middleware chal raha hai");
    console.log("User:", req.user);

    res.locals.success = req.flash("success");

    res.locals.error = req.flash("error");

    res.locals.currUser = req.user || null;

    next();
});


// Home route
app.get("/", (req, res) => {
    return res.redirect("/listings");
});


// Listings routes
app.use("/listings", listingsroutes);


// Reviews routes
app.use("/listings/:id/reviews", reviewsroutes);


// User routes
app.use("/", usersroutes);


// 404 Error
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Error Handling Middleware
app.use((err, req, res, next) => {

    let { statusCode = 500 } = err;

    if (!err.message) {
        err.message = "Something went wrong!";
    }

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).render("error.ejs", { err });
});


// Server start
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("server is listening to port " + port);
});