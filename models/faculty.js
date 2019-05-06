var mongoose=require("mongoose");
var bcrypt=require('bcrypt-nodejs');

var FacultySchema= new mongoose.Schema({

	types:{type:String,default:"Faculty"},
	username:String,
	password:String,
	email:String,
	subject:String,
	contactno:String,
	resetPasswordToken:String,
	leave:["Leave"]
 //    l
	// eave:[{type:mongoose.Schema.Types.ObjectId,
	// 	ref:"Leave"}],
})

FacultySchema.pre("save",function(next) {
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

FacultySchema.methods.comparePassword=function(password){
	return bcrypt.compareSync(password,this.password)
 }

 module.exports=mongoose.model("Faculty",FacultySchema)    
