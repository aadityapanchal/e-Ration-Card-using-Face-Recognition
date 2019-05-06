var express = require('express')
var passport = require("passport")
var mongoose = require("mongoose")
//const fileUpload = require('express-fileupload');
var bodyparser=require('body-parser');
var Faculty=require("./models/faculty")
var Admin=require("./models/admin")
var Student=require("./models/student")
var Leave=require("./models/leave")
var cookieParser = require('cookie-parser')
var session = require("express-session")
var Attendance = require("./models/attendance")
var timetable = require("./models/timetable")
var result = require("./one.json")
var passportConf = require("./config/amapassport")
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var rand,mailOptions,host,link;
var exphbs=require('express-handlebars');0
var csv      = require('csv-express');
var stringify=require("csv-stringify")
const http = require("http");
var app=express();
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var upload = multer({ dest: 'tmp/' });
var json=require("./two.json");
var ps= require('python-shell');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};


app.set('views', path.join(__dirname, 'views'));
app.engine('html', exphbs({defaultLayout:'main'}));
app.set('view engine', 'html');
app.set('view engine', 'ejs');

var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "verifyverify19@gmail.com",
		pass: "Gmail1234"
	}
});

mongoose.connect("mongodb://localhost/AttendanceSystem", function (err) {
	if (err) {
		console.log(err)
	}
	else {
		console.log("Connected1")
	}
})

//app.use(express.static('public'));

app.use(express.static(path.join(__dirname, "/public")));

app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/img',express.static('public/img'));
app.use('*/lib',express.static('public/lib'));
app.use('*/faculty',express.static('public/faculty'));

app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookieParser("hey"));



app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: "hey",
	//store:new MongoStore({url:"mongodb://localhost/amazon",autoReconnect:true})
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
	res.locals.user = req.user
	next()
})
//var index=require("./public/js/index.js");
app.use(bodyparser.json());

app.get('/signup', function (req, res) {
	res.render('signup.html');
})

app.post("/signup", function (req, res) {
	var admin = new Admin()
	//user.profile.name=req.body.name
	admin.username = req.body.name;
	admin.password = req.body.password;
	Admin.findOne({ username: req.body.name }, function (err, existingUser) {
		if (existingUser) {
			console.log(req.body.enrollno + "already exists")
			return res.redirect("/signup")
		}
		else {
			admin.save(function (err, user, next) {
				// if(err) return next(err);
				req.logIn(admin, function (err) {
					//if(err) return next(err);
					console.log(req.user + "user")
					res.redirect("/main")
				})
			})
		}
	})
})

app.get("/login", isLoggedOut, function (req, res) {
	res.render('login.html');
}
)

app.post("/Adminlogin", function (req, res) {
	passport.authenticate("admin-login", function (err, user, params) {
		if (req.xhr) {
			
			if (err) {
				return res.json({ error: err.message });
			}

			
			if (!user && params) {
				return res.json({ error: params.error });
			}
			if (!user) {
				return res.json({ error: "Invalid Login" });
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.json({ error: err });

				}

				return res.json({
					user: {
						id: req.user.id,
						email: req.user.email,
						joined: req.user.joined
					},
					success: true
				});
			});
		}
		else {
			if (err) {
				return res.redirect("/login");
			}
			if (!user) {
				return res.redirect("/login");
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.redirect("/login");
				}
				
				return res.redirect("/main");
			});
		}
	})(req, res);
});


app.post("/Facultylogin", function (req, res) {
	passport.authenticate("faculty-login", function (err, user, params) {
		if (req.xhr) {
			
			if (err) {
				return res.json({ error: err.message });
			}

			// e.g. in auth.js:
			// if (!user.emailVerified) { return done(null, false, { message: 'Email is not verified. Please check your email for the link.' }); }
			if (!user && params) {
				return res.json({ error: params.error });
			}
			if (!user) {
				return res.json({ error: "Invalid Login" });
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.json({ error: err });
				}
				return res.json({
					user: {
						id: req.user.id,
						email: req.user.email,
						joined: req.user.joined
					},
					success: true
				});
			});
		}
		else {
			if (err) {
				return res.redirect("/login");
			}
			if (!user) {
				return res.redirect("/login");
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.redirect("/login");
				}
				return res.redirect("/main");
			});
		}
	})(req, res);
});


app.post("/Studentlogin", function (req, res) {

	passport.authenticate("student-login", function (err, user, params) {
		if (req.xhr) {
		
			if (err) {
				return res.json({ error: err.message });
			}

			// e.g. in auth.js:
			// if (!user.emailVerified) { return done(null, false, { message: 'Email is not verified. Please check your email for the link.' }); }
			if (!user && params) {
				return res.json({ error: params.error });
			}
			if (!user) {
				return res.json({ error: "Invalid Login" });
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.json({ error: err });
				}
				return res.json({
					user: {
						id: req.user.id,
						email: req.user.email,
						joined: req.user.joined
					},
					success: true
				});
			});
		} else {
			if (err) {
				return res.redirect("/login");
			}
			if (!user) {
				return res.redirect("/login");
			}
			req.login(user, {}, function (err) {
				if (err) {
					return res.redirect("/login");
				}
				return res.redirect("/main");
			});
		}
	})(req, res);
});


app.post("/admin/addfaculty", function (req, res) {
	var name = req.body.name;
	var subject=req.body.subject;
	var email=req.body.email;
	var contactno=req.body.contactno
	var password = req.body.password;
	var newfaculty = { username: name,password: password,email:email,subject:subject,contactno:contactno };

	Faculty.create(newfaculty, function (err, faculty) {
		if (err) {
			console.log(err)
		}
		else {
			res.redirect("/admin")
		}
	}
	)
})

app.post("/admin/addstudent", function (req, res) {
	var student = new Student()
	student.username = req.body.enrollmentno;
	student.name = req.body.name;
	student.department = req.body.department;
	student.email = req.body.email;
	student.contact = req.body.contactno;
    student.password = req.body.password;
	Student.findOne({ username: req.body.enrollmentno }, function (err, existingUser) {
		if (existingUser) {
			console.log(req.body.enrollno + "already exists")

			return res.redirect("/admin")
		}
		else {

			student.save(function (err, user, next) {
				console.log(req.user._id + "user")
				res.redirect("/admin")
			})
		}
	})
})

app.post("/pythonrun",function(req,res){
var options = {
  //mode: 'text',
  //pythonPath: 'path/to/python',
  //pythonOptions: ['-u'],
  //scriptPath: 'path/to/my/scripts',
  args: ['-n','Jury']
};
ps.PythonShell.run('create_dataset.py',options, function (err, results) {
  if (err) throw err;
  console.log('finished');
  console.log(results);
});
})


app.get("/admin", function (req, res) {
	// Admin.findById(req.user._id, function (err, User) {
		res.render("Admin.html");
	})
app.get("/admin/addstudent", isLoggedIn, isAdmin, function (req, res) {
	Admin.findById(req.user._id, function (err, User) {
		res.render("final/Admin/addstu", { User: User });
	})
})
app.get("/admin/addfaculty", isLoggedIn, isAdmin, function (req, res) {
	Admin.findById(req.user._id, function (err, User) {
		res.render("final/Admin/addfac", { User: User });
	})
})
app.get("/student", isLoggedIn, function (req, res) {
	Student.findById(req.user._id, function (err, User) {
		res.render("final/Student/index", { User: User });
	})
})

app.get("/faculty", isLoggedIn, isFaculty, function (req, res) {
	Faculty.findById(req.user._id, function (err, User) {
		res.render("Faculty", { User: User });
	})
})

app.get("/teacher", function (req, res) {
	Faculty.findById(req.user._id, function (err, User) {
		res.render("Faculty.html", { User: User });
	})
})

app.get("/main", isLoggedIn, function (req, res) {
	var x = req.user.types;
	res.redirect("/" + x);
})

app.post("/login", function (req, res) {
	res.redirect("/login")
})

app.get("/logout", function (req, res) {
	req.logout()
	res.redirect("/main")
})

app.get("/forgot", function (req, res) {
	res.render("forgotpassword.html", { user: req.user })
})

app.post('/forgot', function (req, res, next) {
	random = Math.floor((Math.random() * 100000000000) + 54);
	host = req.get('host');
	link = "http://" + req.get('host') + "/reset/" + random;
	Student.findOne({ email: req.body.email }, function (err, user) {
		if (!user) {
			//req.flash('error', 'No account with that email address exists.');
			Faculty.findOne({ email: req.body.email }, function (err, users) {
				if (!users) {
					//req.flash('error', 'No account with that email address exists.');
					return res.redirect('/forgot');
				}
			
				users.resetPasswordToken = random;
				//user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
				users.save();
				mailOptions = {
					to: req.body.email,
					subject: "Reset Password Link",
					html: "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to reset your password</a>"
				}
				
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
						res.end("error");
					}
					else {
						
						res.end("sent Verify it to see profile");
					}
				})
			})
		} else {
			
			user.resetPasswordToken = random;
			//user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
			user.save();
			mailOptions = {
				to: req.body.email,
				subject: "Reset Password Link",
				html: "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to reset your password</a>"
			}
			
			smtpTransport.sendMail(mailOptions, function (error, response) {
				if (error) {
					console.log(error);
					res.end("error");
				} else {
					console.log("Message sent: " + response.message);
					res.end("sent Verify it to see profile");
					a = 1;
				}
			})
		}
	})
})

app.get('/reset/:token', function (req, res) {
	Student.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
		if (!user) {
			// req.flash('error', 'Password reset token is invalid or has expired.');
			Faculty.findOne({ resetPasswordToken: req.params.token }, function (err, users) {
				if (!users) {
					// req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('/forgot');
				}
				
				res.render('reset.html', {
					user: req.user
				});
				//return res.redirect('/forgot');
			})
		}
		else {
			res.render('reset.html', {
				user: req.user
			});
		}
	});
});

app.post('/reset/:token', function (req, res) {
	Student.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
		if (!user) {
			// req.flash('error', 'Password reset token is invalid or has expired.');
			Faculty.findOne({ resetPasswordToken: req.params.token }, function (err, users) {
				if (!users) {
					// req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('/forgot');
				} 
				users.password = req.body.password;
				users.resetPasswordToken = undefined;
				users.save();
				
				return res.redirect("/login")
			});
		}
		else {
			
			user.password = req.body.password;
			user.resetPasswordToken = undefined;
			user.save();
			
			res.redirect("/login")
		}
	});
});

app.get("/leave", isLoggedIn, function (req, res) {
	Student.findById(req.user._id, function (err, User) {
		res.render("final/Student/leave", { User: User });
	})
})

app.get("/leave/:file", function (req, res) {
	 var filePath = "/leave/"+req.params.file+".pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
})})

app.post(
"/file_upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
  const tempPath = req.file.path;
     const targetPath = path.join(__dirname, "./leave/"+req.user.username+".pdf");

    if (path.extname(req.file.originalname).toLowerCase() === ".pdf") {
      fs.rename(tempPath, targetPath, err => {
        if (err) console.log(err);
  
     var enrollmentno=req.body.Enrollment;
     var name =req.body.name;
     var subject=req.body.subject;
     var from=req.body.from;
     
     var to=req.body.to;
         var newleave={EnrollmentNo:enrollmentno,Name:name,Subject:subject,From:from,To:to,Document:req.file.originalname}
      Faculty.findOne({subject:subject},function(err,User){
      	if(err) throw err;
       Leave.create(newleave,function(err,leave){
        if(err) throw err;
          
          User.leave.push(leave);
          User.save();
          res.redirect("/main");
        })
         
     })
});
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        res
          .status(403)
          .contentType("text/plain")
          .end("Only .pdf files are allowed!");
      });
    }
  }
);      

app.get('/chart', async function (req, res, err) {
	Attendance.findOne({ EnrollmentNo: req.user.username }).then(async (data) => {
		// console.log(JSON.stringify(data));
		var json = {}
		var labels = []
		var counts = []
		await Promise.all(data.subjectList.map(async (subject) => {
			json[subject] = 0;
			labels.push(subject)
			data.attendance.map((element) => {
				if (element.subjectname == subject) {
					json[subject] += 1;
				}
			});
			let object = await timetable.findOne({ SubjectName: subject });
			await counts.push((json[subject] / object.count) * 100);
		})).then(() =>
			res.render('data-chart', { labels, counts })
		);
	}, (err) => {
		console.log('Something wen wrong while fetching user data', err);
		console.log('render ok');
	});
});


app.get('/upload', function(req, res) {
  console.log("uploaded data");
//var json=req.body.data;
console.log(json[0]+"srupid ")
     var dateobj = new Date();
      var b=dateobj.toString();
      var char=b.split(' ');
      var day=char[0];
      console.log(char[1]+"  "+ char[2]+"  " +char[3]);
      var time=char[4];
      var timeind=time.split(":");
      var hh=timeind[0];
      var mm=timeind[1];
      var ss=timeind[2];
      console.log(mm+"mmfirst");
      if(mm%2!=0){
       mm=mm-1;
       if(mm<10){
        mm="0"+mm;
       }
       }
       var final1=day + " " + hh +":" + mm;
       console.log(final1+"jhgh")
       final="Mon 10:24"
    
       timetable.findOneAndUpdate({Date:final},{$inc: { count: 1 } },function(err,timetable){
       if(timetable){
       var date= char[1]+" "+ char[2]+" " +char[3];
       var time=hh+":"+mm;
       var status="P";
       for(i=0;i<json.e_no.length;i++){
          Attendance.findOne({EnrollmentNo:json.e_no[i]},function(err,user){
            if(err) throw err;
             newdate={subjectname:timetable.SubjectName,date:date,time:time,status:status}
             user.attendance.push(newdate);
             user.save(); 
            console.log(user.EnrollmentNo +"is Present")
          })
        }}})
        res.status(200).send("success")})


app.get("/teacher/:class",function(req,res){
     console.log(req.params.class+"class");
     var absent=[];
     var present=[];
     if(req.params.class=="212"){
	  var dateobj = new Date();
      var b=dateobj.toString();
      var char=b.split(' ');
      var day=char[0];
      console.log(char[1]+"  "+ char[2]+"  " +char[3]);
      var time=char[4];
      var timeind=time.split(":");
      var hh=timeind[0];
      var mm=timeind[1];
      var ss=timeind[2];
      console.log(mm+"mmfirst");
      if(mm%2!=0){
       mm=mm-1;
       if(mm<10){
        mm="0"+mm;
       }
       }
       var date= char[1]+" "+ char[2]+" " +char[3];
       var final1=day + " " + hh +":" + mm;
       var time=hh+":"+mm;
       Attendance.find({},function(err,user){

       	 Attendance.find({
      attendance: {
        $elemMatch: {
          time: time, date:date
       }
      } }, function (err, attenders) {
      if (err) throw err;
       for(i=0;i<user.length;i++){
       	var flag=0
      for(j=0;j<attenders.length;j++){
      	
      	if(attenders[j].EnrollmentNo==user[i].EnrollmentNo){
          flag=1;
      	}
      }
      if(flag==0){
      	absent.push(user[i].EnrollmentNo);
      }
      else{
      	present.push(user[i].EnrollmentNo);
      }
  }
  res.render("teachers.html",{absent:absent, User:req.user.username, present:present,class:req.params.class})
       })
       })
   }
 })

app.get("/:EnrollmentNo",function(req,res){
	Attendance.findOne({EnrollmentNo:req.params.EnrollmentNo},function(err,user){
		console.log(user+"user")
		res.render("individual.ejs",{user:user,EnrollmentNo:req.params.EnrollmentNo})
	})
})

function isLoggedOut(req, res, next) {
	// if user is authenticated in the session, carry on
	if (!req.user) {
		return next();
	}

	res.redirect("/main")
}


function isAdmin(req, res, next) {

	if (req.user.types === "Admin") {
		return next()
	}

	res.redirect("/main")

}

function isFaculty(req, res, next) {

	if (req.user.types === "Faculty") {
		return next()
	}

	res.redirect("/main")

}


function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated()) {

		return next();

	}
	// if they aren't redirect them to the home page

	res.redirect('/login');
}

app.listen(3000, function (err) {
	if (err) {
		console.log(err);
	}
	else {
		console.log("Magic happens at http://localhost:3000");
	}
});

