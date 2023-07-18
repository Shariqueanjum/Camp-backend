const User=require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('user/register')


};

module.exports.register=async (req,res,next)=>{
    try{
    const {username,email,password}=req.body;
    const user=new User({
        username:username,
        email:email
    });
    try{
    const authnUser=await User.register(user,password);
    req.logIn(authnUser,(e)=>{
       if(e) return next(e);
       req.flash('success','successufully registerd')
       res.redirect('/campgrounds');
    });
    }catch(e){
        req.flash('error',e.message)
       return res.redirect('/register');
    }
   
}catch(e){
 next(e);
}
};

module.exports.renderLogin=(req,res)=>{
    res.render('user/login')
};

module.exports.login=(req,res)=>{
    req.flash('success','welcome back');
   const redirectUrl=res.locals.requestTo || '/campgrounds';
    res.redirect(redirectUrl);

};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
      if(err){
          return next(err);
      }
      req.flash('success','Goodbye!!');
      res.redirect('/campgrounds');
    }) 
  
};