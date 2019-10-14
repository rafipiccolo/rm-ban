var express = require('express');
var Logger = require('raf-logger');
var config = {
    console: true,
    socketPassword: 'xxx',
    // socketPort: '443',
    // socketHost: 'localhost',
    padSize: 20,
};
var logger = new Logger(config);

const app = express();

var ban = require('./index.js');
app.use(ban(app, logger));

app.get('/banme', (req, res) => {
    req.ban('bravo');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

var port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log('Example app listening on port ' + port + '!'),
);
