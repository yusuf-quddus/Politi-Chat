const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4  } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

const topics = [
    {
        topic: 'Gun Control',
        room1: uuidv4(), 
        room2: uuidv4(),
        description: "Should we have more or less gun control?",
        image: "https://cdn.britannica.com/45/190745-050-1F7EC780/Gun-Constitution.jpg"
    },
    {
        topic: 'Abortion',
        room1: uuidv4(), 
        room2: uuidv4(),
        description: "Should U.S law be pro-life or pro-choice?",
        image: "https://www.marylandmatters.org/wp-content/uploads/2024/04/GettyImages-1458045593-scaled.jpg"
    },
    {
        topic: 'Tax Policy',
        room1: uuidv4(), 
        room2: uuidv4(),
        description: "Should we increase or decrease taxes?",
        image: "https://www.taxpolicycenter.org/sites/default/files/styles/landscape_480x360/public/initiatives/shutterstock_94126492_copy1_copy_0.jpg?itok=ekcY_b8I"
    },
    {
        topic: 'Ukrain',
        room1: uuidv4(), 
        room2: uuidv4(),
        description: "Should we be more or less involved in the war in Ukraine?",
        image: "https://www.globalr2p.org/wp-content/uploads/2023/03/Ukraine_64.png"
    }
]

var numClients = 0;

app.get('/', (req, res) => {
    res.render('home', { topics, numClients })
    console.log(numClients)
    //res.redirect(`/${uuidv4()}}`);
})
// trying to join room2 when numClients is in room 1 more than room 2

// :room is parameter or variable for id. from redirect
app.get('/:room', (req, res) => {
    // render room file with unique room id. 
    res.render('room', { roomId: req.params.room }) // req.params.room from res.redirect
})

io.on('connection', socket  => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        numClients = io.sockets.adapter.rooms.get(roomId).size
        socket.to(roomId).emit('user-connected', userId);
    })  
})

server.listen(3030);
