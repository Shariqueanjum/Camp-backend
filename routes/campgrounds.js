const express=require("express");
const router=express.Router();
const Campground=require('../models/campground');
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware.js');
const campground = require("../models/campground");
const campgrounds=require('../controllers/campgrounds');
const {storage}=require('../cloudinary');
const multer  = require('multer')
const upload = multer({ storage});






router.get('/',campgrounds.index);
   
router.get('/new',isLoggedIn,campgrounds.renderNewForm);
   
router.post('/',isLoggedIn,upload.array('image'),validateCampground,campgrounds.createCampground);


// router.post('/',upload.single('image'),(req,res)=>{
//     console.log(req.body,req.file)
//     res.send("it worked");

// })
   
router.get('/:id',campgrounds.showCampground);
   
router.get('/:id/edit',isLoggedIn,isAuthor,campgrounds.renderEditForm);
   
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateCampground, campgrounds.updateCampground);
   
router.delete('/:id', isLoggedIn, isAuthor, campgrounds.deleteCampground);


module.exports=router;