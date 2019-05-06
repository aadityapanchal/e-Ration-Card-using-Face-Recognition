var mongoose=require("mongoose");
var bcrypt=require('bcrypt-nodejs');

var StudentSchema= new mongoose.Schema({

	types:{type:String,default:"Student"},
	username:String,
	name:String,
	department:String,
	contact:String,
	email:String,
	password:String,
	resetPasswordToken:String

	


})

StudentSchema.pre("save",function(next) {
	var user=this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(10,function(err,salt) {
		if(err) return next(err);
bcrypt.hash(user.password,salt,null,function(err,hash){
	if(err) return next(err);
		user.password=hash
	next();
})

	})
})


//compare password 

StudentSchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password)
 }

 module.exports=mongoose.model("Student",StudentSchema)    
