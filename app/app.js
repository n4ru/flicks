var Accel = require('ui/accel');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var UI = require('ui');
var Vector2 = require('vector2');
var Light = require('ui/light');
var port = "3939";
var host = "http://192.168.0.100";
var flick = 'none';
var flickNames = [];
var version = '.2';

// Show Logo && Loading Text
var wind = new UI.Window({
	fullscreen: true
});
var image = new UI.Image({
	position: new Vector2(0, -30),
	size: new Vector2(144, 168),
	image: 'images/flicks.png'
});
var spinner = new UI.Image({
	position: new Vector2(112, 0),
	size: new Vector2(32, 32),
	image: 'images/spin.png'
});

var element = new UI.Text({
	position: new Vector2(0, 90),
	size: new Vector2(144, 30),
	font: 'GOTHIC_28_BOLD',
	textAlign: 'center',
	textOverflow: 'wrap'
});

var vtext = new UI.Text({
	position: new Vector2(0, 0),
	size: new Vector2(30, 30),
	font: 'GOTHIC_24'
});
var rtext = new UI.Text({
	position: new Vector2(0, 100),
	size: new Vector2(144, 30),
	font: 'GOTHIC_28_BOLD',
	textAlign: 'center'
});

vtext.text(version);
rtext.text("loading flicks...");

wind.add(rtext);
wind.add(vtext);
wind.add(image);
wind.add(element);
wind.show();


function flicked() {
	wind.remove(Accel); // Suspend Handler
	wind.add(spinner);
	ajax({
			url: host + ':' + port + '?flick=' + encodeURIComponent(flick),
			method: 'get'
		},
		function(data, status, request) {
			wind.remove(spinner);
			Accel.init();
			Accel.on('tap', function(e) {
				flicked();
			});
			Vibe.vibrate('short');
		},
		function(error, status, request) {
			element.color("red");
			element.text("flicks disconnected!");
			Light.trigger();
		});
}

function loadFlicks() {
	wind.add(spinner);
	ajax({
			url: host + ':' + port + '?flick=' + flick,
			method: 'get'
		},
		function(data, status, request) {
			rtext.text("...");
			wind.remove(spinner);
			element.color("green");
			flickNames = JSON.parse(data);
			flick = flickNames[0];
			element.text(flick);
			Vibe.vibrate('short');

			// Wrist Flick
			Accel.init();
			Accel.on('tap', function(e) {
				flicked();
			});

			// Switch flicks
			wind.on('click', 'up', function() {
				if (typeof flickNames[flickNames.indexOf(flick) + 1] === 'undefined')
					flick = flickNames[0];
				else
					flick = flickNames[flickNames.indexOf(flick) + 1];
				element.text(flick);
			});
			wind.on('click', 'down', function() {
				if (typeof flickNames[flickNames.indexOf(flick) - 1] === 'undefined')
					flick = flickNames[flickNames.length - 1];
				else
					flick = flickNames[flickNames.indexOf(flick) - 1];
				element.text(flick);
			});
			wind.on('click', 'select', function() {
				flicked();
			});
			wind.on('longClick', 'select', function() {
				rtext.text("refreshing...");
				flick = "none";
				loadFlicks();
			});
		},
		function(error, status, request) {
			element.color("red");
			element.text("flicks misconfigured!");
			Light.trigger();
		});
}

loadFlicks();