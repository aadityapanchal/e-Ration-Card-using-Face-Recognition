var mongoose=require('mongoose');

 mongoose.connect("mongodb://localhost/local",function(err){
  if(err){
    console.log(err)
  }
  else{
    console.log("connected")
  }
})