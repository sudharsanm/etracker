var http = require("http");
var fs = require("fs");
var path = require("path");
var express = require("express");
//var bodyParser = require('body-parser');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//app.set('view engine', 'pug');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res){
    response.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/Track',function(req, res){
  res.sendFile(path.join(__dirname, 'public/Track.html'));
  //app.use(express.static(path.join(__dirname, '/public/Track.html')));
});

app.get('/Detail',function(req, res){
  res.sendFile(path.join(__dirname, 'public/TrackDetail.html'));
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