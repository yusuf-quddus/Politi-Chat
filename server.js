const express = require('express')
const app = express()
const path = require('path')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuid } = require('uuid')
const topics = ['Lobbying', 'Abortion', 'Gun Control']

const Queue = require('./public/queue.js')
const { get } = require('http')
const lobbyingQueue = new Queue()
const abortionQueue = new Queue()
const gunControlQueue = new Queue()

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.static('assets'))
app.use(express.static('styles'))

app.get('/index', (req, res) => {
    res.render(path.join(__dirname, 'views/index.ejs'), { topics })
})

app.get('/topic/:t', (req, res) => {
    const topic = req.params.t
    res.render(path.join(__dirname, 'views/topic.ejs'), { topic })
});

app.get('/topic/:t/redirect', (req, res) => {
    const topic = req.params.t
    const opinion = req.query.opinion
    var q = getQueue(topic)
    var roomId = q.pop()
    if (roomId == null) {
        roomId = uuid()
        q.push(roomId)
    }
    res.redirect(`/topic/${topic}/${roomId}`)
})

app.get('/topic/:t/:room', (req, res) => {
    res.render(path.join(__dirname, 'views/room.ejs'), { roomId: req.params.room })
})

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'))
})

// Contains protocol for handling connections
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)
    })
})

server.listen(3000, () => {
    console.log("listening on 3000")
})

function getQueue(topic) {
    const ind = topics.indexOf(topic)
    switch(ind) {
        case -1:
            return null
        case 0:
            return lobbyingQueue
        case 1:
            return abortionQueue
        case 2:
            return gunControlQueue
    }
}