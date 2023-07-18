const Campground=require('./models/campground');
const ExpressError=require('./ExpressError');
const {campgroundSchema,reviewSchema}=require('./Schemas.js');
const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    // console.log(req.path);
    // console.log(req.originalUrl);
    req.session.requestTo=req.originalUrl;
    req.flash('error','You have to login first!');
    return res.redirect('/login');
   }
     next();
}

module.exports.storeReturnTo=(req,res,next)=>{
   if(req.session.requestTo){
    res.locals.requestTo=req.session.requestTo;
   }
   next();
}

module.exports.isAuthor=async(req,res,next)=>{
   const{id}=req.params;
   const campground=await Campground.findById(id);
   if(!campground.author.equals(req.user._id)){
      req.flash('error','Sorry you have no permission to edit it!!!');
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports. validateCampground=(req,res,next)=>{
   const result= campgroundSchema.validate(req.body);
   const{error}=result;
   if(error){
       const msg=error.details.map(el=> el.message).join(',');
       throw new ExpressError(msg,404);
   }
   else{
      next();
   }
};

module.exports.validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
   if (error) {
       const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
   } else {
       next();
   }
};

module.exports.isReviewAuthor=async (req,res,next)=>{
   try{
   const{id,revId}=req.params;
   const review=await Review.findById(revId);
   if(!review.author.equals(req.user._id)){
      req.flash('error','Sorry you have no permission to edit it!!!');
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
   }catch(e){
      next(e);
   }
};
