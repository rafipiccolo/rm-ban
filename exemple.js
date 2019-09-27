var express = require('express');

const app = express();

var ban = require('./index.js');
app.use(ban(app));

app.get('/banme', (req, res) => {
    req.ban('bravo');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

var port = process.env.PORT || 3000;
app.listen(port, () =>
    console.log('Example app listening on port '+port+'!'),
);
