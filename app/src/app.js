var Accel = require('ui/accel');
var Vibe = require('ui/vibe');
var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');

var timeOut = '';
var version = '>> ';
var progress = false;
var reload = true; // If we're reloading, disable commands
var flick = 'none'; // Current action
var handlers = false; // Handlers not registered yet
var flickNames = []; // Array of actions

// Initialize host
if (typeof Settings.option('host') === "undefined" || Settings.option('host') === "")
    var host = "127.0.0.1";
else
    var host = Settings.option('host');

var wind = new UI.Window({
    fullscreen: true
});

// Logo
var back = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor: 'green'
});

// Sidebar
var sidebar = new UI.Rect({
    position: new Vector2(124, 0),
    size: new Vector2(20, 168),
    backgroundColor: 'black'
});

// Icons
var icon = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(124, 100),
    backgroundColor: 'clear'
});


var error = new UI.Image({
    position: new Vector2(129, 5),
    size: new Vector2(11, 11),
    image: 'images/x.png'
});

var prog = new UI.Image({
    position: new Vector2(129, 153),
    size: new Vector2(10, 10),
    image: 'images/c.png'
});

var up = new UI.Image({
    position: new Vector2(129, 30),
    size: new Vector2(12, 7),
    image: 'images/action_bar_icon_up.png'
});

var down = new UI.Image({
    position: new Vector2(129, 131),
    size: new Vector2(12, 7),
    image: 'images/action_bar_icon_down.png'
});

var ell = new UI.Image({
    position: new Vector2(127, 82),
    size: new Vector2(16, 4),
    image: 'images/music_icon_ellipsis.png'
});

var element = new UI.Text({
    position: new Vector2(0, -3),
    size: new Vector2(124, 10),
    font: 'GOTHIC_24',
    textAlign: 'center',
    color: 'black',
    text: '---'
});

var debug = new UI.Text({
    position: new Vector2(2, 148),
    size: new Vector2(124, 20),
    font: 'GOTHIC_14',
    textAlign: 'left',
    color: 'black',
    text: version
});

var cons = new UI.Text({
    position: new Vector2(2, 148),
    size: new Vector2(124, 20),
    font: 'GOTHIC_14',
    textAlign: 'left',
    color: 'black',
    text: version
});

var getReturn = new UI.Text({
    position: new Vector2(2, 22),
    size: new Vector2(124, 123),
    font: 'GOTHIC_14',
    textAlign: 'left',
    color: 'black',
    text: '> started.'
});

wind.show();
wind.add(back);
wind.add(icon);
wind.add(sidebar);
wind.add(element);
wind.add(getReturn);
wind.add(cons);

// Register Handlers
if (!handlers) {
    // Wrist Flick
    Accel.init();
    Accel.on('tap', function(e) {
        if (!reload && !progress) {
            flicked();
        }
    });
    wind.on('click', 'up', function() {
        if (!reload && !progress) {
            if (typeof flickNames[flickNames.indexOf(flick) + 1] === 'undefined')
                flick = flickNames[0];
            else
                flick = flickNames[flickNames.indexOf(flick) + 1];
            element.text(flick);
        }
    });
    wind.on('click', 'down', function() {
        if (!reload && !progress) {
            if (typeof flickNames[flickNames.indexOf(flick) - 1] === 'undefined')
                flick = flickNames[flickNames.length - 1];
            else
                flick = flickNames[flickNames.indexOf(flick) - 1];
            element.text(flick);
        }
    });
    handlers = true;
}

function resetTimeout() {
	clearTimeout(timeOut);
	timeOut = setTimeout(function() {
		failed();
	}, 20000);
}

function flicked() {
    if (!reload && !progress) {
        progress = true;
        wind.remove(up);
        wind.remove(down);
        wind.add(prog);
        ws.send(flick);
		resetTimeout();
    }
}

function failed() {
    wind.remove(prog);
    wind.remove(up);
    wind.remove(down);
    wind.add(error);
    reload = true;
    progress = false;
    element.text('---');
	cons.text('>> disconnected');
    getReturn.text(('> disconnected.' + '\n' + getReturn.text()).substring(0, 1024));
    Vibe.vibrate('short');
}

function loadFlicks() {
    element.text('---');
	if (typeof ws !== "undefined")
		ws.close();
    ws = new WebSocket('ws://' + host + ':3940');
	ws.onmessage = function(event) {
        var msg = JSON.parse(event.data);
        resetTimeout();
        wind.add(up);
        wind.add(down);
        wind.remove(prog);
        wind.remove(error);
        progress = false;
        switch (msg.type) {
            case 'cmdlets':
                reload = false;
                getReturn.text(('> connected.' + '\n' + getReturn.text()).substring(0, 1024));
                flickNames = msg.flicks;
                flick = flickNames[0];
                element.text(flick);
                Vibe.vibrate('short');
                break;
            case 'console':
                cons.text('>> ' + msg.data);
                Vibe.vibrate('short');
                break;
            case 'response':
                getReturn.text(('> ' + msg.data + '\n' + getReturn.text()).substring(0, 1024));
                debug.text('flick executed.');
                Vibe.vibrate('short');
                break;
        }
    };
    resetTimeout();
    reload = true;
    wind.add(prog);
    wind.remove(up);
    wind.remove(down);
}

loadFlicks();

wind.on('longClick', 'select', function() {
    loadFlicks();
});

wind.on('click', 'select', function() {
    if (!reload && !progress) {
        flicked();
    }
});

wind.add(ell);

Settings.config({
        url: 'http://n4ru.it/flicks/'
    },
    function(e) {
        Settings.option('host', e.options.host);
        host = Settings.option('host');
        loadFlicks();
    }
);