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
var Ws = require('ws');
var WebSocketServer = Ws.Server,
    wss = new WebSocketServer({
        port: 3940
    }),
    webSockets = [];

flickNames = [];
for (names in flicks) {
    flickNames.push(names);
}

flickObject = {
    "type": "cmdlets",
    "flicks": flickNames
}

var transmit = function(data) {
        for (var i = 0; i < webSockets.length; i++) {
    		try {
            	webSockets[i].send(data);
    		} catch (err) {
    			delete webSockets[i];
    			continue;
    		}
        }
};

var keepalive = setInterval(function() {
    transmit('{"type":"keepalive"}');
}, 15000);

wss.on('connection', function(ws) {
    webSockets.push(ws);
    ws.send('{"type":"console", "data":"connected to ws"}');
    ws.send(JSON.stringify(flickObject));
    console.log('>> device connected');
    ws.on('close', function() {

        console.log(">> device disconnected.")
    })
    ws.on('error', function() {
        console.log('>> device disconnected.')
    })
    ws.on('message', function(msg) {
        if (msg != "keepalive") {
            for (i in flickNames) {
                if (msg == flickNames[i]) {
                    if (typeof flicks[flickNames[i]]["success"] === "undefined") {
                        spawn.exec(flicks[flickNames[i]]["cmd"]);
                        transmit('{"type":"response", "data":"success."}');
                        console.log("> success.");
                    } else if (flicks[flickNames[i]]["success"] == ".raw") {
                        spawn.exec(flicks[flickNames[i]]["cmd"], function(error, stdout, stderr) {
                            response.write(stdout.replace(/\n/g, ''));
                            console.log("> " + stdout.replace(/\n/g, ''));
                        });
                    } else {
                        spawn.exec(flicks[flickNames[i]]["cmd"]);
                        transmit('{"type":"response", "data":"' + flicks[flickNames[i]]["success"] + '"}');
                        console.log("> " + flicks[flickNames[i]]["success"]);
                    }
                }
            }
        }
    })
});

for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(addresses + ':' + serverPort + ' is ready for Flicks!');