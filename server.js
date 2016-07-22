var http = require("http");
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require('body-parser');

var mongojs = require("mongojs");
//Remote
var db = mongojs(process.env.mongoConnection);
var mCategory = db.collection('Category');
var mtrack = db.collection("tracks");

//Local
//var db = mongojs('TrackExpense');
//var mCategory = db.collection('Category_ef9dd82b-12e8-4a93-a320-fd515d21e5a0');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.set('view engine', 'pug');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

// app.get('/C', function(req, res){
//     res.send("Mongo Connection string " + process.env.mongoConnection || "C");
//     //response.sendFile(path.join(__dirname, 'public/index.html'));
// });

app.get('/Track',function(req, res){
  res.sendFile(path.join(__dirname, 'public/Track.html'));
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});

app.get('/Detail',function(req, res){
  res.sendFile(path.join(__dirname, 'public/TrackDetail.html'));
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});

app.get('/categories',function(req, res){
  console.log('Inside GET')
  mCategory.find(function(err,docs)
  {
    console.log(docs);
    res.json(docs);
  }
  );
  
});

app.get('/categories/:id',function(req, res){
  console.log('Inside GET ID');
  var id = req.params.id;
  mCategory.findOne({_id: mongojs.ObjectId(id)},function (err, docs) {
    console.log(docs);
    res.json(docs);
  })
  console.log(id);
});

app.post('/categories',function(req, res){
  console.log('Inside POST')
  console.log(req.body);
  mCategory.insert(req.body, function(err, docs) {
    
    console.log(docs);
    res.json(docs);  
  })
  
});

app.get('/categoriesForCombo',function(req, res){
  console.log('Inside GET')
  mCategory.find({},{_id:0,CategoryName:1},function(err,docs)
  {
    console.log(docs);
    res.json(docs);  
  }
  );
  
});

app.post('/Track',function(req, res){
  console.log('Inside POST')
  console.log(req.body);
  mtrack.insert(req.body, function(err, docs) {
    
    console.log(docs);
    res.json(docs);  
  })
  
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