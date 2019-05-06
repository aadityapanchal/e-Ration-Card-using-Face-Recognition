var mongoose=require("mongoose");

var AttendanceSchema= new mongoose.Schema({

  
  	EnrollmentNo:String,
    subjectList:Array,

    attendance:[
    {
        subjectname:String,
    	date:String,
        time:String,
    	status:String
    }
    ]

    


  
	


})


 module.exports=mongoose.model("Attendance",AttendanceSchema)    