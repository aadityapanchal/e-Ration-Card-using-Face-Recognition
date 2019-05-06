var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var BookingSchema =new mongoose.Schema({
	start:String,
	final:String,
	price:String,
	distance:String
})

 module.exports=mongoose.model("Booking",BookingSchema)   