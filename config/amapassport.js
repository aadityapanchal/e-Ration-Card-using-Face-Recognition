var passport=require("passport")
var LocalStrategy=require('passport-local').Strategy;
//var FacebookStrategy=require('passport-facebook').Strategy;
//var secret=require("../config/amasecret")
var Admin=require("../models/admin")
var Student=require("../models/student")
var Faculty=require("../models/faculty")
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');



//serialize and deserialize
passport.serializeUser(function(user,done) {
	done(null,user)
})


passport.deserializeUser(function(user,done) {
	//Admin.findById(id,function(err,user) {
		done(null,user)
	//})
})


//Middleware

passport.use("admin-login",new LocalStrategy({
usernameField:'email',
passwordField:"password",
passReqToCallback:true
},
function(req,email,password,done) {
	Admin.findOne({username:email},function(err,user) {
		
		if(err) return done(err);
		if(!user){
			// alert("No User")
			console.log("No users")

			var msg="no users"

			localStorage.setItem("msg","no user")
		
           
			return done(null,false)
			 //return JsonResponse({'status': True})
		}

		if(!user.comparePassword(password)){
			console.log("Wrong Passwords")

				 //localStorage.setItem("msg","Wrong Password")
			return done(null,false)
		}
		return done(null,user)
	})
}
))


passport.use("student-login",new LocalStrategy({
usernameField:'email',
passwordField:"password",
passReqToCallback:true,

},
function(req,email,password,done) {
	Student.findOne({username:email},function(err,user) {
	   var msg
		
		if(err) return done(err);
		if(!user){
			// alert("No User")
			

        msg="No user"
        console.log("Real no user")
        localStorage.setItem("msg",msg);
        //alert(localStorage.getItem("msg")+"njbjjh")
			return done(null,false)
		}

		if(!user.comparePassword(password)){
			console.log("Wrong Password")
			msg="Wrong Password"
			   localStorage.setItem("msg",msg);
			return done(null,false)
		}

			msg="Success"
				   localStorage.setItem("msg",msg);
		return done(null,user)
		
	})
}
))




passport.use("faculty-login",new LocalStrategy({
usernameField:'email',
passwordField:"password",
passReqToCallback:true
},
function(req,email,password,done) {
	Faculty.findOne({username:email},function(err,user) {
	
		
		if(err) return done(err);
		if(!user){
			// alert("No User")
			console.log("No user")

			return done(null,false)
		}

		if(!user.comparePassword(password)){
			console.log("Wrong Password")
			
			return done(null,false)
		}
		return done(null,user)
	})
}
))


// passport.use(new FacebookStrategy(secret.facebook, function(token,refreshToken,profile,done){
// 	User.findOne({facebook:profile_id},function (err,user) {
// 		if(err) return done(err);

// 		if(user){
// 			return done(null,user);
// 		}else{
//         var newUser=new User();
//         newUser.email=profile._json.email
//         newUser.facebook=profile.id;
//         newUser.tokens.push({kind:"facebook",token:token})
//         newUser.profile.name=profile.displayName;
//         newUser.profile.picture="https://graph.facebook.com/"+profile.id+'/picture?type=large'
//         newUser.save(function (err) {
//         	if(err) throw err;
//         	return done(null,newUser);
//         	// body...
//         })



// 		}
// 		// body...
// 	})
// }))


exports.isAuthenticated=function(req,res,next) {
	if(req.isAuthenticated()){
		return next()
	}
	// body...
	res.redirect("/login")
}

// var msg=localStorage.getItem("msg")
// module.exports={
// message:msg
// }