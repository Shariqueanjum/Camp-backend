
     require('dotenv').config();


const express=require("express");
const path=require("path");
const app=express();
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const ExpressError=require('./ExpressError');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local");
const User=require('./models/user')
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const CampgroundRouter=require('./routes/campgrounds.js');
const ReviewRouter=require('./routes/reviews.js');
const UserRouter=require('./routes/users.js');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("Mongoose setup is done");
})
.catch((e)=>{
    console.log(e)
})


app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
//app.use(express.static('public'));
//it's better to use the below code for static rather than above one!!
app.use(express.static(path.join(__dirname,'public')))



app.use(mongoSanitize({
    replaceWith: '_'
}))



const sessionConfig={
    name:'session',
    secret:'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
       httpOnly: true,
       //secure:true,
       expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
       maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());



const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzo9yuqfe/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
    

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
});


app.get('/',(req,res)=>{
    res.render('home');
})


app.use('/campgrounds',CampgroundRouter);
app.use('/campgrounds/:id/reviews',ReviewRouter);
app.use('/',UserRouter);
   








app.all('*',(req,res,next)=>{
    next (new ExpressError('Page Not Found',404));
});

app.use((err,req,res,next)=>{
    const {message='Something went wrong',statusCode=500}=err;
    console.log(err.details);
   res.status(statusCode).render('error',{err});



})



app.listen(3000,()=>{
    console.log('on port 3000')
})