var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var TimetableSchema =new mongoose.Schema({
	SubjectName:String,
	Date:String,
	count:{type:Number,default:0,required:true}


})

 module.exports=mongoose.model("Timetable",TimetableSchema)   