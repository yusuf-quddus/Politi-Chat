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
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}}`);
})

// :room is parameter or variable for id. from redirect
app.get('/:room', (req, res) => {
    // render room file with unique room id. 
    res.render('room', { roomId: req.params.room }) // req.params.room from res.redirect
})

io.on('connection', socket  => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        //socket.to(roomId).broadcast.emit('user-connected');
        socket.to(roomId).emit('user-connected', userId);
    })  
})

server.listen(3030);