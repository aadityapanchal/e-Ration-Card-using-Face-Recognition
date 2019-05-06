var mongoose=require("mongoose");


var LeaveSchema= new mongoose.Schema({


    EnrollmentNo:String,
	Name:String,
    Subject:String,
	From:String,
	To:String,
	Document:String
	
})

module.exports=mongoose.model("Leave",LeaveSchema)    
