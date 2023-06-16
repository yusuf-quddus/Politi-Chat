const express = require('express');
const app = express();
const path = require('path')
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4, v4  } = require('uuid');
const { ExpressPeerServer } = require('peer');
const Queue = require('./public/queue.js')
const { get } = require('http')
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.use(express.static('assets'))
app.use(express.static('styles'))

const topics = [
    {
        topic: 'Gun Control',
        description: "Should we have more or less gun control?",
        image: "https://cdn.britannica.com/45/190745-050-1F7EC780/Gun-Constitution.jpg"
    },
    {
        topic: 'Abortion',
        description: "Should U.S law be pro-life or pro-choice?",
        image: "https://www.marylandmatters.org/wp-content/uploads/2024/04/GettyImages-1458045593-scaled.jpg"
    },
    {
        topic: 'Tax Policy',
        description: "Should we increase or decrease taxes?",
        image: "https://www.taxpolicycenter.org/sites/default/files/styles/landscape_480x360/public/initiatives/shutterstock_94126492_copy1_copy_0.jpg?itok=ekcY_b8I"
    },
    {
        topic: 'Ukraine',
        description: "Should we be more or less involved with Ukraine?",
        image: "https://www.globalr2p.org/wp-content/uploads/2023/03/Ukraine_64.png"
    }
]

const qList = [
    {
        topic: 'Gun Control',
        lowQueue: new Queue(),
        highQueue: new Queue()
    },
    {
        topic: 'Abortion',
        lowQueue: new Queue(),
        highQueue: new Queue()
    },
    {
        topic: 'Tax Policy',
        lowQueue: new Queue(),
        highQueue: new Queue()
    },
    {
        topic: 'Ukraine',
        lowQueue: new Queue(),
        highQueue: new Queue()

    }
]

app.get('/', (req, res) => {
    res.render(path.join(__dirname, 'views/index.ejs'), { topics })
})

app.get('/topic/:t', (req, res) => {
    const topic = req.params.t
    res.render(path.join(__dirname, 'views/topic.ejs'), { topic })
});

app.get('/topic/:t/redirect', (req, res) => {
    const topic = req.params.t
    const opinion = req.query.opinion
    var q = getQueue(topic, opinion)
    var roomId = q.pop()
    if (roomId == null) {
        roomId = v4()
        q.push(roomId)
    }
    res.redirect(`/topic/${topic}/${roomId}`)
})

app.get('/topic/:t/:room', (req, res) => {
    res.render(path.join(__dirname, 'views/room.ejs'), { roomId: req.params.room })
})

app.get('/favicon.ico', (req, res) => {
    res.redirect('/retFile/favicon')
})

app.get('/retFile/:file', (req, res) => {
    const file = req.params.file
    switch(file) {
        case "script":
            res.sendFile(path.join(__dirname, '/public/script.js'))
            break
        case "style":
            res.sendFile(path.join(__dirname, '/styles/style.css'))
            break
        case "favicon":
            res.sendFile(path.join(__dirname, '/assets/favicon.png'))
            break
    }
})

app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.html'))
})

// Contains protocol for handling connections
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {

        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    })  
}) 

server.listen(3000, () => {
    console.log("listening on 3000")
})

function getQueue(topic, opinion) {
    const ind = qList.findIndex(item => item.topic === topic)
    if (ind == -1) {
        return null
    } else if (opinion >= 5) {
        return qList.at(ind).highQueue
    } else {
        return qList.at(ind).lowQueue
    }
}

