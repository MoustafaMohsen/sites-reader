var http = require("http");
var https = require("https");
var fs = require("fs");

/*
var server = http.createServer(function(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });

  https.get("https://www.wikipedia.org", function(response) {
    var responseBody = "";
    response.setEncoding("UTF-8")
    response.on("data", function(chunk) {
      responseBody += chunk;
    });
    response.on("end", function() {
        res.end(responseBody)
      });
  }); //get

}); //createServer

server.listen(3000);
console.log("Server listening on port 3000");



*/
 