var spawn = require("child_process");
var fs = require('fs');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var user = "null";
var serverPort = 1338;
var os = require('os');
require('./config.js');
var myvar = false;
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

http.createServer(function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    //if (request.method === "GET" && !myvar) {
        response.writeHead(200);
        spawn.exec(flicks["Flick1"]["cmd"]);
        response.end();
        myvar = true;
    /*} else {
        response.writeHead(200);
        spawn.exec(flicks["Flick2"]["cmd"]);
        response.end();
        myvar = false;
    }
    */
}).listen(serverPort);
console.log(addresses + ':' + serverPort + ' is ready for Flicks!');