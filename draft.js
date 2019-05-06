 // var filename   = "Attendance.csv";

/*  Attendance.find().lean().exec({}, function(err, products) {
        if (err) res.send(err);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(products, true);
    });*/
//console.log(columns[0]+"columns")
    let data = [];
//     var fft=[10,20];

//       var dateobj = new Date();
//       var b=dateobj.toString();
//       var char=b.split(' ');
//       var day=char[0];
//       var time=char[4];
//       var timeind=time.split(":");
//       var hh=timeind[0];
//       var mm=timeind[1];
//       var ss=timeind[2];
//       var final=day + " " + hh +":" + mm;
let data1=[]
for(i=0;i<10;i++){
  data1.push(i);
}
// columns.push(final)
json={...columns};

// Attendance.aggregate(
//  [ { "$match": { "EnrollmentNo": "160010107049" } },
//   // { "$unwind": "$friends" },
//   // { "$match": { "friends.status": 0 } },
//   function( err, data ) {

//     if ( err )
//       throw err;

//     console.log( JSON.stringify( data, undefined, 2 ) );

//   }
// ]);

// Attendance.aggregate([
//                 { $match: { $and: [{'attendance.subjectname' : 'WT' }, {'attendance.date':"2019-02-17 15:26:04.103"} ]},
//                 // { $group: {
//                 //     _id: '$id',
//                 //     game_total: { $sum: '$game_amount'}, 
//                 //     game_total_profit: { $sum: '$game_profit'}}
//                 // }}
// ]).exec(function ( e, d ) {
//     console.log( d.length+"d")            
// });


// Attendance.aggregate([
//                    { 
//                      $match: {
//                           $and: [ 
//                               {'attendance.subjectname':'WT' }, 
//                               { 'attendance.date':new Date("2019-02-16 15:26:04.103")}
//                               // {time: {$lt:ISODate("2013-12-09T00:00:00Z")}}
//                           ]
//                      }
//                    }
//                   ]).exec(function ( e, d ) {
//     console.log( d.length+"d" )    

// });
//makeCSV();


// Attendance.aggregate([
//   { "$match": { 
//     //"_id": mongoose.Types.ObjectId(req.params.id),
//     "attendance": {
//       "$elemMatch": { "$gte": start, "$lt": end }
//     }
//   }}])
// .exec(function ( e, d ) {
//   console.log( d.length+"d" )            
//  });




function add(){

      var dateobj = new Date();
      var b=dateobj.toString();
      var char=b.split(' ');
      var day=char[0];
      var time=char[4];
      var timeind=time.split(":");
      var hh=timeind[0];
      var mm=timeind[1];
      var ss=timeind[2];
       
      // if(mm>=20 &&mm<40){
      //   mm=20
      //  }
      //  else if(mm>=40 &&mm<60){
      //   mm=40
      //  }
      //  else{
      //   mm="00";
      //  }
        console.log(mm+"mmfirst");

       if(mm%2!=0){
       mm=mm-1;
       if(mm<10){
        mm="0"+mm;
       }
       }

    
       console.log(mm+"mm");
       var final=day + " " + hh +":" + mm;
       console.log(final+"final");
       timetable.findOne({Date:final},function(err,timetable){
       if(timetable){
       console.log("Schedule:" + timetable.Date)
       console.log("SubjectName:" + timetable.SubjectName)
       var date= new Date();
      
        var status,newdate;
       Attendance.find({ },function(err,user){
           if(err)
           {
           console.log(err);
           }
           else
           {
              for(i=0;i<user.length;i++){
                if(result.e_no.indexOf(parseInt(user[i].EnrollmentNo))==-1){
                  //status='A';
                }
                
                else{
                  status='P'
                  newdate={subjectname:timetable.SubjectName,date:date,status:status}
                 user[i].attendance.push(newdate);
            user[i].save();
            console.log("added")
                }

       
              }
           
            }
            })
          }  
      else
      {
      console.log("Not found")
      }
      }
      )
      setTimeout(add,120000)
      }



        // if(mm>=20 &&mm<40){
      //   mm=20
      //  }
      //  else if(mm>=40 &&mm<60){
      //   mm=40
      //  }
      //  else{
      //   mm="00";
      //  }




      app.get("/attendance", function (req, res) {
  console.log("hiii")
  var date = "28Jan"
  var status = true
  var i = 0;
  var newdate = { date: date, status: status }
  for (i = 0; i < 50; i++) {
    Attendance.findOne({ EnrollmentNo: "160010107049" }, function (err, user) {
      user.WT.push(newdate);
      user.save();
      console.log(user)
    })
  }
})


      let columns = [
  'EnrollmentNo', "2019-02-22", "2019-02-23"
]
app.post("/exporttocsv", function (req, res) {
  let data = [];
  json = { ...columns };
  
  var i = 1;
  var count=0;
  var subjectname = req.body.subjectname;
  function makeTable() {
    let enroll = [];
    var start = columns[i] + "T00:00:00.000Z"
    var end = "2019-02-23" + "T18:00:00.000Z"
    console.log(start);
    console.log(start);
    Attendance.find({
      attendance: {
        $elemMatch: {
          subjectname: subjectname, date:
            { $gte: new Date(start).toISOString(), $lt: new Date(end).toISOString() }
        }
      }
    }, function (err, attenders) {
      if (err) throw err;
      console.log(attenders.length)
      for (k = 0; k < attenders.length; k++) {
        enroll.push(attenders[k].EnrollmentNo)
      }
      
      Attendance.find({}, function (err, user) {
        if (err) throw err;
        for (j = 0; j < user.length; j++) {
          
          if(count<user.length){
            data.push([user[j].EnrollmentNo])
            count++;
          }
          if (enroll.indexOf(user[j].EnrollmentNo) == -1) {

            data[j].push("A")
          }
          else {
            data[j].push("P")

          }
        }
        
        stringify(data, { header: true, columns: json }, (err, output) => {
          if (err) throw err;
          console.log(output+"out")
          fs.writeFile('' + subjectname + '.csv', output, (err) => {
            if (err) throw err;
            console.log('' + subjectname + '.csv saved.');
          });
        });

      })
    })
    i++;
    
    if (i < columns.length) {
      setTimeout(makeTable, 100);
    }
    else {
      res.send('' + subjectname + '.csv written');
    }
  }
  makeTable();

})



app.get("/getcsv", function (req, res) {
  Attendance.findOne({ EnrollmentNo: "160010107001" }, function (err, user) {
    console.log(user)
    res.render("getcsv", { user: user });
  })
})




// app.get('/chart', function (req, res, err) {
//  Attendance.findOne({ EnrollmentNo: req.user.username }).then((data) => {
//    // console.log(JSON.stringify(data));
//    var json = {}
//    var labels = []
//    var counts = []
//    data.subjectList.map((subject) => {
//      json[subject] = 0;
//      labels.push(subject)
//      data.attendance.map((element) => {
//        if (element.subjectname == subject) {
//          json[subject] += 1;
//        }
//      });
//      timetable.findOne({ SubjectName: subject })
//        .then((timetable) => {
//          counts.push((json[subject] /
//            timetable.count) * 100);
//        });
//    });
//    console.log(json);
//    console.log(labels);
//    console.log(counts);
//    res.render('data-chart', { labels, counts });
//  }, (err) => {
//    console.log('Something wen wrong while fetching user data', err);
//    console.log('render ok');
//  });
// });



function add() {

  var dateobj = new Date();
  var b = dateobj.toString();
  var char = b.split(' ');
  var day = char[0];
  var time = char[4];
  var timeind = time.split(":");
  var hh = timeind[0];
  var mm = timeind[1];
  var ss = timeind[2];
  console.log(mm + "mmfirst");
  if (mm % 2 != 0) {
    mm = mm - 1;
    if (mm < 10) {
      mm = "0" + mm;
    }
  }
  console.log(mm + "mm");
  var final = day + " " + hh + ":" + mm;
  console.log(final + "final");
  timetable.findOne({ Date: final }, function (err, timetable) {
    if (timetable) {
      console.log("Schedule:" + timetable.Date)
      console.log("SubjectName:" + timetable.SubjectName)
      var date = new Date();
      var status = "P";
      for (i = 0; i < result.e_no.length; i++) {
        Attendance.findOne({ EnrollmentNo: result.e_no[i] }, function (err, user) {
          if (err) throw err;
          newdate = { subjectname: timetable.SubjectName, date: date, status: status }
          user.attendance.push(newdate);
          user.save();
          console.log(user.EnrollmentNo + "is Present")
        })
      }
    }
    else {
      console.log("Not found")
    }
  })
  setTimeout(add, 120000)
}



app.get('/upload', function(req, res) {
  console.log("uploaded data");
//var json=req.body.data;


 console.log(json[0]+"srupid ")
var dateobj = new Date("2019");
      var b=dateobj.toString();
      var char=b.split(' ');
      var day=char[0];
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
       
       var final=day + " " + hh +":" + mm;
       final="Mon 10:24"
    
       timetable.findOneAndUpdate({Date:final},{$inc: { count: 1 } },function(err,timetable){
       if(timetable){

         
       var date= new Date();
       var status="P";
       for(i=0;i<json.length;i++){
          Attendance.findOne({EnrollmentNo:json[i]},function(err,user){
            if(err) throw err;
             newdate={subjectname:timetable.SubjectName,date:date,status:status}
             user.attendance.push(newdate);
             user.save(); 
            console.log(user.EnrollmentNo +"is Present")
          })
        }}})
        res.status(200).send("success")})
