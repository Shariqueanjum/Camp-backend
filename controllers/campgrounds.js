const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken});

module.exports.index=async(req,res,next)=>{
    try{
       const campgrounds=await Campground.find({});
       res.render('campgrounds/index',{campgrounds});
    }
    catch(e){
       next(e);
    }
   };

module.exports.renderNewForm=(req,res)=>{
   res.render('campgrounds/new');
};

module.exports.createCampground=async(req,res,next)=>{
   try{

     const geodata=await geocoder.forwardGeocode({
         query: req.body.campground.location,
         limit: 1
       }).send()

      // res.send(geodata.body.features[0].geometry.coordinates);
      

   const campground=new Campground(req.body.campground);
   campground.images= req.files.map(f=>({ url: f.path, filename: f.filename }))
   campground.author=req.user._id;
   campground.geometry=geodata.body.features[0].geometry;
   await campground.save();
   console.log(campground);
   req.flash('success','Successufully added new campground');
   res.redirect(`/campgrounds/${campground._id}`);
   }
      
   catch(e){
       next(e);
   }
};

module.exports.showCampground=async(req,res,next)=>{
   try{
      const{id}=req.params;
      const campground=await Campground.findById(id).populate({
       path:'reviews',
       populate:{
          path:'author'
       }
      }).populate('author');
      if(!campground){
       req.flash('error','This campground does not exist!!');
       return res.redirect('/campgrounds');
      }
      res.render('campgrounds/show',{campground});
   }
   catch(e){
     next(e);
   }
 };

 module.exports.renderEditForm=async(req,res,next)=>{
try{
   const {id}=req.params;
   const campground= await Campground.findById(id);
   res.render('campgrounds/edit',{campground});
}       
catch(e){
   next(e);
}
 };

 module.exports.updateCampground=async (req, res,next) => {
   try{
   const { id } = req.params;
   
   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
   const imgs=req.files.map(f=>({ url:f.path, filename: f.filename }));
   campground.images.push(...imgs);
   await campground.save();
   if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({$pull: {images: {filename: {$in:req.body.deleteImages}}}})
   }

   // console.log(req.body);
   
   //console.log(campground);
   req.flash('success','successufully updated your campground');
   res.redirect(`/campgrounds/${campground._id}`)
   }
   catch(e){
       next(e);
   }
};

module.exports.deleteCampground=async (req,res,next)=>{
   try{
 const{id}=req.params;
await Campground.findByIdAndDelete(id);
res.redirect('/campgrounds');
   }
   catch(e){
       next(e);
   }


};