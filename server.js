const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const { v4: uuid } = require('uuid');
var lobbyingList = [];
var abortionList = [];
var gunControlList = [];
const topics = ['Lobbying', 'Abortion', 'Gun Control'];
const id1 = null;
const id2 = null;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('assets'));

app.get('/index', (req, res) => {
    res.render(path.join(__dirname, 'views/index.ejs'), {topics});
});

app.get('/topic/:t', (req, res) => {
    const topic = req.params.t;
    const uid = `${uuid()}`;
    res.render(path.join(__dirname, 'views/topic.ejs'), { topic, uid });
});

app.get('/searching', (req, res) => {
    const uid = req.query.ID;
    const opin = req.query.opinion;
    const topic = req.query.topic;
    addID(topic, uid);
    console.log(topic);
    console.log(lobbyingList);
    console.log(abortionList);
    console.log(gunControlList);
    console.log('-----------');
    //console.log(`${uid} searching ${topic} with opinion of ${opin}`);
    res.render(path.join(__dirname, 'views/searching.ejs'), { uid, opin, topic });
});

/*app.get('/client', (req, res) => {
    const uid = req.query.ID;
    const opin = req.query.opinion;
    const topic = req.query.topic;
    res.render(path.join(__dirname, 'views/client.ejs'), { uid, opin, topic });
});*/

app.get('/canceled', (req, res) => {
    const uid = req.query.id;
    const top = req.query.topic;
    rmID(top, uid);
    console.log(top);
    console.log(lobbyingList);
    console.log(abortionList);
    console.log(gunControlList);
    console.log('-----------');
    res.render(path.join(__dirname, 'views/index.ejs'), {topics});
});

/*app.get('/test1', (req, res) => {
    res.render(path.join(__dirname, 'views/client.ejs'));
});

app.get('/test2', (req, res) => {
    res.render(path.join(__dirname, 'views/client2.ejs'));
});*/

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
});

server.listen(3000, () => {
    console.log("listening on 3000");
});

function addID(topic, id) {
    var list = [];
    const ind = topics.indexOf(topic);
    if (ind == 0) {
        list = lobbyingList;
    } else if (ind == 1) {
        list = abortionList;
    } else if (ind == 2) {
        list = gunControlList;
    }
    list.push(id);
}

function rmID(topic, id) {
    var list = [];
    const ind = topics.indexOf(topic);
    if (ind == 0) {
        list = lobbyingList;
    } else if (ind == 1) {
        list = abortionList;
    } else if (ind == 2) {
        list = gunControlList;
    }
    list.splice(list.indexOf(id), 1);
}

function rmIDs(topic, list) {
    var list = [];
    const ind = topics.indexOf(topic);
    if (ind == 0) {
        list = lobbyingList;
    } else if (ind == 1) {
        list = abortionList;
    } else if (ind == 2) {
        list = gunControlList;
    }
    const e1 = list[0];
    const e2 = list[1];
    if (list.length >= 2) {
        list.splice(0, 1);
        list.splice(0, 1);
    }
    return [e1, e2];
}