var Accel = require('ui/accel');
var ajax = require('ajax');
var Vibe = require('ui/vibe');
var UI = require('ui');
var Vector2 = require('vector2');
var Light = require('ui/light');
var Settings = require('settings');

var port = "3939";
var reload = false; // If we're reloading, disable commands
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
    position: new Vector2(0, 24),
    size: new Vector2(124, 30),
    font: 'GOTHIC_24',
    textAlign: 'center',
    textOverflow: 'wrap',
    color: 'black',
    text: 'Loading'
});

var title = new UI.TimeText({
    position: new Vector2(0, 0),
    size: new Vector2(124, 15),
    font: 'GOTHIC_18',
    color: 'black',
    textAlign: 'center',
    text: '%H:%M'
});

var debug = new UI.Text({
    position: new Vector2(2, 153),
    size: new Vector2(124, 15),
    font: 'GOTHIC_14_BOLD',
    textAlign: 'left',
    color: 'black',
    text: 'flicks revision 3'
});

var getReturn = new UI.Text({
    position: new Vector2(0, 54),
    size: new Vector2(124, 99),
    font: 'GOTHIC_18',
    textAlign: 'center',
    color: 'black',
    text: ''
});

wind.show();
wind.add(back);
wind.add(icon);
wind.add(title);
wind.add(sidebar);
wind.add(up);
wind.add(down);
wind.add(ell);
wind.add(debug);
wind.add(element);
wind.add(getReturn);

function flicked() {
    getReturn.text('');
    debug.text('flick activated.');
    if (!reload) {
        ajax({
                url: "http://" + host + ':' + port + '?flick=' + encodeURIComponent(flick),
                method: 'get'
            },
            function(data, status, request) {
                wind.remove(error);
                getReturn.text(data);
                debug.text('flick executed.');
                Vibe.vibrate('short');
            },
            function(error, status, request) {
                ajaxFailed();
            });
    }
}

function ajaxFailed() {
    wind.add(error);
    debug.text('command failed.');
    Light.trigger();
    reload = true;
    getReturn.text('[flicks: Connection Failure]');
    Vibe.vibrate('short');
}

function loadFlicks() {
    ajax({
            url: "http://" + host + ':' + port + '?flick=none',
            method: 'get'
        },
        function(data, status, request) {
            reload = false;
            wind.remove(error);
            flickNames = JSON.parse(data);
            flick = flickNames[0];
            element.text(flick);
            debug.text('flicks loaded.');
            Vibe.vibrate('short');

            // Register Handlers
            if (!handlers) {
                // Wrist Flick
                Accel.init();
                Accel.on('tap', function(e) {
                    flicked();
                });
                wind.on('click', 'up', function() {
                    if (!reload) {
                        if (typeof flickNames[flickNames.indexOf(flick) + 1] === 'undefined')
                            flick = flickNames[0];
                        else
                            flick = flickNames[flickNames.indexOf(flick) + 1];
                        element.text(flick);
                    }
                });
                wind.on('click', 'down', function() {
                    if (!reload) {
                        if (typeof flickNames[flickNames.indexOf(flick) - 1] === 'undefined')
                            flick = flickNames[flickNames.length - 1];
                        else
                            flick = flickNames[flickNames.indexOf(flick) - 1];
                        element.text(flick);
                    }
                });
                wind.on('click', 'select', function() {
                    if (!reload) {
                        flicked();
                    }
                });
                wind.on('longClick', 'select', function() {
                    reload = true;
                    debug.text("refreshing...");
                    loadFlicks();
                });
                handlers = true;
            }
        },
        function(error, status, request) {
            ajaxFailed();
        });
}

loadFlicks();

Settings.config({
        url: 'http://n4ru.it/flicks/'
    },
    function(e) {
        Settings.option('host', e.options.host);
        reload = true;
        debug.text("refreshing...");
        host = Settings.option('host');
        loadFlicks();
    }
);