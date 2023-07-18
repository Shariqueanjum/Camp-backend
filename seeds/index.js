const mongoose=require("mongoose")
const Campground=require('../models/campground');
const cities=require('./cities');
const {places,descriptors}=require('./seedsHelper');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log("Mongoose setup is done");
})
.catch((e)=>{
    console.log(e)
})
const sample=array=>array[Math.floor(Math.random()* array.length)]


const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<200;i++){
     const rand500=Math.floor(Math.random()*500);
     const price = Math.floor(Math.random() * 20) + 10;
      const camp=new Campground({
        author:'648ac47e699cf4607f56cfd3',
        location:`${cities[rand500].city}, ${cities[rand500].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
        price,
        geometry: {
          type: "Point",
          coordinates: [
            cities[rand500].longitude,
            cities[rand500].latitude,
          ]
      },
        images: [
          {
            url: 'https://res.cloudinary.com/dzo9yuqfe/image/upload/v1687530232/YelpCamp/equwf1tcumbn5xnmpn2q.jpg',
            filename: 'YelpCamp/equwf1tcumbn5xnmpn2q', 
          }
        ],
      
      })
      await camp.save();


    }
}
seedDB()
.then(()=>{
  mongoose.connection.close();
});