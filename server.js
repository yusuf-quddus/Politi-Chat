const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const { v4: uuid } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('assets'));

app.get('/index', (req, res) => {
    const topics = ['Lobbying', 'Abortion', 'Gun Control'];
    res.render(path.join(__dirname, 'views/index.ejs'), {topics});
});

app.get('/topic/:number', (req, res) => {
    const topic = req.params.number;
    const uid = `${uuid()}`;
    res.render(path.join(__dirname, 'views/topic.ejs'), { topic, uid });
});

app.get('/searching', (req, res) => {
    const uid = req.query.ID;
    const opin = req.query.opinion;
    const topic = req.query.topic;
    console.log(`${uid} searching ${topic} with opinion of ${opin}`);
    res.render(path.join(__dirname, 'views/searching.ejs'), { uid, opin, topic });
});

app.get('/client', (req, res) => {
    const uid = req.query.ID;
    const opin = req.query.opinion;
    const topic = req.query.topic;
    res.render(path.join(__dirname, 'views/client.ejs'), { uid, opin, topic });
});

app.get('/test1', (req, res) => {
    res.render(path.join(__dirname, 'views/client.ejs'));
});

app.get('/test2', (req, res) => {
    res.render(path.join(__dirname, 'views/client2.ejs'));
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
});

server.listen(3000, () => {
    console.log("listening on 3000");
});