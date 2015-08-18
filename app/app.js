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

wind.add(image);
wind.add(element);
wind.show();

element.text("refreshing...");

function flicked() {
    if (!reload) {
        wind.add(spinner);
        ajax({
                url: "http://" + host + ':' + port + '?flick=' + encodeURIComponent(flick),
                method: 'get'
            },
            function(data, status, request) {
                wind.remove(spinner);
                Vibe.vibrate('short');
            },
            function(error, status, request) {
                element.color("red");
                element.text("flicks disconnected!");
                reload = true;
                Light.trigger();
            });
    }
}

function loadFlicks() {
    wind.add(spinner);
    ajax({
            url: "http://" + host + ':' + port + '?flick=none',
            method: 'get'
        },
        function(data, status, request) {
            reload = false;
            wind.remove(spinner);
            element.color("green");
            flickNames = JSON.parse(data);
            flick = flickNames[0];
            element.text(flick);
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
                    element.text("refreshing...");
                    loadFlicks();
                });
                handlers = true;
            }
        },
        function(error, status, request) {
            element.color("red");
            element.text("flicks misconfigured");
            Light.trigger();
        });
}

loadFlicks();

Settings.config({
        url: 'http://n4ru.it/flicks/'
    },
    function(e) {
        Settings.option('host', e.options.host);
        reload = true;
        element.text("refreshing...");
        host = Settings.option('host');
        loadFlicks();
    }
);