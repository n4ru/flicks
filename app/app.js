var Accel = require('ui/accel');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var UI = require('ui');
var Vector2 = require('vector2');

// Wrist Flick
Accel.init();
Accel.on('tap', function(e) {
	ajax({ url: 'http://10.1.20.35:1338', method:'get'});
	Vibe.vibrate('short');
});

// Show Logo
var wind = new UI.Window({ fullscreen: true });
var image = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: 'images/flicks.png'
});
wind.add(image);
wind.show();