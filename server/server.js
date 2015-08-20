var spawn = require("child_process");
var fs = require('fs');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var user = "null";
var serverPort = 3939;
var os = require('os');
var flicks = require('./config.json');
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

flickNames = [];
for (names in flicks) {
	flickNames.push(names);
}

http.createServer(function(request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'GET');
	if (request.method === "GET") {
		var query = url.parse(request.url, true).query;
		response.writeHead(200);
		if (query.flick && query.flick != "none") {
			for (i in flickNames) {
				if (query.flick == flickNames[i]) {
					if (typeof flicks[flickNames[i]]["success"] === "undefined") {
						spawn.exec(flicks[flickNames[i]]["cmd"]);
						response.write("success.");
						console.log("> success.");
						response.end();
					} else if (flicks[flickNames[i]]["success"] == ".raw") {
						spawn.exec(flicks[flickNames[i]]["cmd"], function(error, stdout, stderr) {
							response.write(stdout.replace(/\n/g,''));
    						console.log("> " + stdout.replace(/\n/g,''));
							response.end();
						});
					} else {
						spawn.exec(flicks[flickNames[i]]["cmd"]);
						response.write(flicks[flickNames[i]]["success"]);
						console.log("> " + flicks[flickNames[i]]["success"]);
						response.end();
					}
				}
			}
		} else if (query.flick && query.flick == "none")  {
			response.write(JSON.stringify(flickNames));
			response.end();
		}
	}
}).listen(serverPort);
console.log(addresses + ':' + serverPort + ' is ready for Flicks!');