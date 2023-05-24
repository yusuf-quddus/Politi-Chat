const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuid } = require('uuid');
const topics = ['Lobbying', 'Abortion', 'Gun Control'];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('assets'));

app.get('/index', (req, res) => {
    res.render(path.join(__dirname, 'views/index.ejs'), { topics });
});

app.get('/topic/:t', (req, res) => {
    const topic = req.params.t;
    res.render(path.join(__dirname, 'views/topic.ejs'), { topic });
});

app.get('/topic/:t/redirect', (req, res) => {
    const topic = req.params.t;
    res.redirect(`/topic/${topic}/${uuid()}`);
});

app.get('/topic/:t/:room', (req, res) => {
    res.render(path.join(__dirname, 'views/room.ejs'), { roomId: req.params.room });
});

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId);
    })
});

server.listen(3000, () => {
    console.log("listening on 3000");
});