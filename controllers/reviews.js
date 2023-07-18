const Campground=require('../models/campground');
const Review=require('../models/review');

module.exports.createReview=async(req,res,next)=>{
    try{
      const{id}=req.params;
      const campground=await Campground.findById(id);
      const review=new Review(req.body.review);
      review.author=req.user._id;
      campground.reviews.push(review);
      await campground.save();
      await review.save();
      res.redirect(`/campgrounds/${id}`);
    }
    catch(e){
        next(e);
    }
    
    };

module.exports.deleteReview=async(req,res,next)=>{
    try{
   const {id,revId}=req.params;
   await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}});
   await Review.findByIdAndDelete(id);

   res.redirect(`/campgrounds/${id}`);

    }
    catch(e){
        next(e);
    }


};