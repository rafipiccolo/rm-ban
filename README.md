# Description

express middleware to handle banned users (based on ip)

# Install

	$> npm -g install rm-ban

# Usage

    var ban = require('rm-ban');
    app.use(ban(app));

or

    var ban = require('rm-ban');
    var Logger = require('raf-logger');
    var logger = new Logger();
    app.use(ban(app, logger));

# exemple

see [exemple.js](exemple.js)

call /banme to get banned
restart server to clean ban cache
