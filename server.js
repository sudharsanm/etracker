var http = require("http");
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require('body-parser');

var mongojs = require("mongojs");
//Remote
var db = mongojs(process.env.mongoConnection);
var mCategory = db.collection('Category');


//Local
//var db = mongojs('TrackExpense');
//var mCategory = db.collection('Category_ef9dd82b-12e8-4a93-a320-fd515d21e5a0');

var session = require('express-session');
var mtrack = db.collection("tracks");
var common = require('./public/common.js');

var app = express();
app.use(session({secret:'ssshhhh',saveUninitialized: true,
                 resave: true}));

var sess;

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

// app.get('/C', function(req, res){
//     res.send("Mongo Connection string " + process.env.mongoConnection || "C");
//     //response.sendFile(path.join(__dirname, 'public/index.html'));
// });


app.post('/login',function(req,res){
  sess = req.session;
  if(req.body.Password == (process.env.PassCode || "1234" ))  {
    sess.IsValid=true;
    res.json({Status : "Success"});
  }
  else  {
    sess.IsValid=false;
    res.json({Status : "Invalid User"});
  }
  
});


app.get('/Track',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    res.sendFile(path.join(__dirname, 'public/Track.html'));
  }
  else{
    res.sendFile(path.join(__dirname, 'public/index.html'));
  }
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});

app.get('/Detail',function(req, res){
  if(sess !== undefined && sess.IsValid == true) {
    res.sendFile(path.join(__dirname, 'public/TrackDetail.html'));
  }
  else{
    res.sendFile(path.join(__dirname, 'public/index.html'));
  }
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});

app.get('/Category',function(req, res){
  if(sess !== undefined && sess.IsValid == true) {
    res.sendFile(path.join(__dirname, 'public/Category.html'));
  }
  else{
    res.sendFile(path.join(__dirname, 'public/index.html'));
  }
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});


app.get('/categories',function(req, res){
  common.Log('Inside GET')
  mCategory.find(function(err,docs)
  {
    common.Log(docs);
    res.json(docs);
  }
  );
  
});

app.get('/categories/:id',function(req, res){
  common.Log('Inside GET ID');
  var id = req.params.id;
  mCategory.findOne({_id: mongojs.ObjectId(id)},function (err, docs) {
    common.Log(docs);
    res.json(docs);
  })
  common.Log(id);
});

app.post('/categories',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    common.Log('Inside POST')
    common.Log(req.body);
    mCategory.insert(req.body, function(err, docs) {
      
      common.Log(docs);
      res.json(docs);  
    })
  }
});

app.delete('/categories/:id',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    common.Log('Inside DELETE');
    var id = req.params.id;
    mCategory.remove({_id: mongojs.ObjectId(id)},function (err, docs) {
      common.Log(docs);
      res.json(docs);
    })
    common.Log(id);
  }
});

app.put('/categories/:id',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    var id = req.params.id;
    common.Log(req.body.CategoryName);
    mCategory.findAndModify({query : {_id: mongojs.ObjectId(id)},
        update: {$set: {CategoryName : req.body.CategoryName, IsActive : req.body.IsActive }},
        new: true}, function (err, docs) {
      common.Log(docs);
      res.json(docs);
    });
  }
});

app.get('/categoriesForCombo',function(req, res){
  common.Log('Inside GET')
  mCategory.find({},{_id:0,CategoryName:1},function(err,docs)
  {
    common.Log(docs);
    res.json(docs);  
  }
  );
  
});

app.post('/Track',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    common.Log('Inside POST')
    common.Log(req.body);
    mtrack.insert(req.body, function(err, docs) {
      
      common.Log(docs);
      res.json(docs);  
    })
  }
});

app.delete('/trackDetail/:id',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    common.Log('Inside DELETE Track');
    var id = req.params.id;
    mtrack.remove({_id: mongojs.ObjectId(id)},function (err, docs) {
      common.Log(docs);
      res.json(docs);
    })
    common.Log(id);
  }
});

app.put('/trackDetail/:id',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    var id = req.params.id;
    common.Log(req.body);
    mtrack.findAndModify({query : {_id: mongojs.ObjectId(id)},
        update: {$set: {Amount : req.body.Amount}},
        new: true}, function (err, docs) {
      common.Log(docs);
      res.json(docs);
    });
  }
});

app.get('/trackDetail',function(req, res){
  if(sess !== undefined && sess.IsValid == true)  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    var year = query["MonthYear"].split('-')[0];
    var month = query["MonthYear"].split('-')[1];
    
    common.Log('Inside trackDetail Get');
    mtrack.find({TrackDate : {$gte : year + "-"+ month +"-01T00:00:00Z", $lt : common.getNextMonthYear(month, year) + "-"+ common.getNextMonth(month) +"-01T00:00:00Z" }},function(err,docs)
    {
      common.Log(docs);
      res.json(docs);  
    }
    );
  }
});


app.get('/TrackSum/:id',function(req, res){
  common.Log("Inside TrackSum");
  var id = req.params.id;
  var year = id.split('-')[0];
  var month = id.split('-')[1];
  var nextMonth = parseInt(month);
  var nextYear = parseInt(year)
  if(nextMonth == 12){
    nextMonth = 1;
    nextYear =nextYear + 1; 
  }
  else{
    nextMonth = nextMonth + 1; 
  }
  
  if (nextMonth<10){
         nextMonth="0" + nextMonth;
         };
   
  mtrack.aggregate([{$match : {TrackDate : {$gte : year + "-"+ month +"-01T00:00:00Z", $lt : nextYear + "-"+ nextMonth +"-01T00:00:00Z" }}}, 
    {$group: { _id : "1", "Total" : {$sum: "$Amount" }}}],
  function (err, docs) {
    common.Log(docs);
    res.json(docs);
  });
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});

app.get('/TrackSum/:id',function(req, res){
  common.Log("Inside TrackSum");
  var id = req.params.id;
  var year = id.split('-')[0];
  var month = id.split('-')[1];
  var nextMonth = parseInt(month);
  var nextYear = parseInt(year)
  if(nextMonth == 12){
    nextMonth = 1;
    nextYear =nextYear + 1; 
  }
  else{
    nextMonth = nextMonth + 1; 
  }
  
  if (nextMonth<10){
         nextMonth="0" + nextMonth;
         };
   
  trackCollection.aggregate([{$match : {TrackDate : {$gte : year + "-"+ month +"-01T00:00:00Z", $lt : nextYear + "-"+ nextMonth +"-01T00:00:00Z" }}}, 
    {$group: { _id : "1", "Total" : {$sum: "$Amount" }}}],
  function (err, docs) {
    common.Log(docs);
    res.json(docs);
  });
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});

app.get('/CategoryWiseTrack/:id',function(req, res){
  common.Log("Inside CategoryWiseTrack");
  var id = req.params.id;
  var year = id.split('-')[0];
  var month = id.split('-')[1];
  var nextMonth = parseInt(month);
  var nextYear = parseInt(year)
  if(nextMonth == 12){
    nextMonth = 1;
    nextYear =nextYear + 1; 
  }
  else{
    nextMonth = nextMonth + 1; 
  }
  if (nextMonth<10){
         nextMonth="0" + nextMonth;
         };
         
  mtrack.aggregate([{$match : {TrackDate : {$gte : year + "-"+ month +"-01T00:00:00Z", $lt : nextYear + "-"+ nextMonth +"-01T00:00:00Z" }}}, 
    {$group: { "_id" : "$Category", "Total" : {$sum: "$Amount" }}}],
  function (err, docs) {
    common.Log(docs);
    res.json(docs);
  });
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// var server = http.createServer(function(request, response) {
//     response.sendFile(path.join(__dirname, 'public/index.html'));
// });

var port = Number(process.env.PORT || 3000);
app.listen(port);