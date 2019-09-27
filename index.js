'use strict';

var pkg = require('./package.json')

module.exports = function (app, logger) {
    /*
    * refresh local ban list
    */
    var bans = [];
    var bansrefresh = null;
    function getBanLoop() {
        logger.getBans((err, thebans) => {
            if (err) logger.error(pkg.name, 'impossible to get ban list', { err: err });

            bans = thebans;
            bansrefresh = new Date();

            setTimeout(() => {
                getBanLoop();
            }, 60000)
        });
    };
    if (logger) getBanLoop();
    
    
    // routes par defaut
    app.get('/ban', function (req, res, next) {
        res.sendFile(__dirname + '/ban.html');
    });
    app.get('/ban.jpg', function (req, res, next) {
        res.sendFile(__dirname + '/ban.jpg');
    });
    app.get('/bans', function (req, res, next) {
        res.send({ bans: bans, bansrefresh: bansrefresh });
    });


    // banni les gens
    return function (req, res, next) {
        req.ban = function (reason) {
            ban(reason, req, res, next);
        };

        // si script dans les parametres
        if (req.originalUrl.indexOf('<script>') != -1) return req.ban("balise script dans l'url");

        // si cherche des fichiers chelou
        if (
            // req.originalUrl.match(/^\/.*\.php$/) ||
            // req.originalUrl.match(/^\/.*\.html?$/) ||
            req.originalUrl.match(/^\/.*\.ini$/) ||
            req.originalUrl.match(/^\/.*\.do$/) ||
            req.originalUrl.match(/^\/.*\.aspx?$/) ||
            req.originalUrl.match(/^\/\.git/) ||
            req.originalUrl.match(/^\/.*\.jsp$/) ||
            req.originalUrl.match(/^\/cgi-bin$/) ||
            req.originalUrl.match(/^\/joomla/) ||
            req.originalUrl.match(/^\/phpmyadmin/) ||
            req.originalUrl.match(/^\/sqlite/) ||
            req.originalUrl.match(/^\/webdav/) ||
            req.originalUrl.match(/^\/drupal/) ||
            req.originalUrl.match(/^\/administrator/) ||
            req.originalUrl.match(/^\/cms/) ||
            req.originalUrl.match(/^\/sql/) ||
            req.originalUrl.match(/^\/mysql/) ||
            req.originalUrl.match(/^\/wp-login/) ||
            req.originalUrl.match(/^\/wp-admin/) ||
            req.originalUrl.match(/^\/config\./)
        )
            return req.ban('url interdite ' + req.originalUrl);

        // if ip déjà banni
        var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim();
        if (bans[ip]) return res.redirect('/ban');

        next();
    };

    function ban(reason, req, res) {
        // on banni l'ip
        var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim();
        if (logger) logger.ban(pkg.name, reason, {
            userId: req.session && req.session.user ? req.session.user.id : null,
            userEmail: req.session && req.session.user ? req.session.user.email : null,
            ip: ip,
            url: req.protocol + '://' + req.host + req.originalUrl,
            method: req.method,
            userAgent: req.get('user-agent'),
        });
        bans[ip] = 1;

        res.redirect('/ban');
    }
}

