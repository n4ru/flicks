![flicks](https://gitlab.com/n4ru/Flicks/raw/master/settings/flicks.png)


Introducing **[flicks](http://n4ru.it/flicks/flicks.png)** - a watch app created to do whatever you want whenever you want - right on your wrist. 

flicks is a 3 part fully configurable and scriptable app that lets you quick launch anything on your computer or any device capable of running nodejs using just your Pebble.

**What's the fastest way to get going?**

- Install the app. 
- Launch the server by running "node server.js". 
- Take note of the IP and save it to the watchapp settings. 
- Ensure your phone is on the same network as the server.

Functions with both Pebble OG and Pebble Time.

**Configuration and Scripting**

The app itself will NOT function without the server being properly configured. When you launch the server, it should give you its IP. Enter ONLY the IP in flicks' settings (NO PORT, NO HTTP://).
The config.js file is the meat of the application. It includes examples that should function on most Windows computers. flicks will work on any OS - modify the configuration any way you want - it's fairly self-explanatory but a full documentation will come within a few updates. There's no limit on how many functions you can implement. You can call entire scripts just like you would from the command line. Don't forget to restart server.js when you make changes to config.js!

**Controls**

Here's the fun part. Upon boot, the Pebble will grab your configuration from the server and display the first one on the screen. To activate it - either flick your wrist or press select. You'll see a dot flash at the top right when you activate commands. When it goes away and the watch vibrates, execution was completed. You can cycle through your functions with the up/down buttons, and if you long-press select it will refresh the configuration from the server.
*flicks runs on port 3940 using WebSockets.*

Make sure to report any issues! There's a lot of work to be done.
Once bugs are ironed out and everything is good to go, it will be up on the app store.

Features:
=========
- **Scripting** to great lengths using direct-from-commandline execution.
- **Unlimited** room for functions and scripts to launch anything you could possibly want.
- **Network Based** so you don't need to be near the PC to launch apps - just configure and go!


Donations:
=========

Paypal - n4ruexe@gmail.com
Bitcoin - 1BkCn4ruJCXUxdt2hygnL6AP7WTVXGVJT5