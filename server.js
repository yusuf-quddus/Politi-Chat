const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('assets'));

app.get('/index', (req, res) => {
    const topics = ['Lobbying', 'Abortion', 'Gun Rights'];
    res.render(path.join(__dirname, 'views/index.ejs'), {topics});
});

app.get('/topic/:number', (req, res) => {
    const n = req.params.number;
    res.render(path.join(__dirname, 'views/topic.ejs'), {n});
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
});

server.listen(3000, () => {
    console.log("listening on 3000");
});