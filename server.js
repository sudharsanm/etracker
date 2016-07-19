var http = require("http");
var fs = require("fs");
var path = require("path");

var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("<h1>Hello World node</h1>");
  response.end();
});

var port = Number(process.env.PORT || 3000);
server.listen(port);