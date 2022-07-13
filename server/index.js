const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

/*constants representing events sent and recieved by the server and client*/

//event sent by client when user wants to join a room
const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
//event sent by server when server has added user to room
const APPROVED_JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
//event sent if user cannot join room
const REJECT_JOIN_ROOM_REQUEST = "REJECT_JOIN_ROOM_REQUEST";

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on(JOIN_ROOM_REQUEST, ({ username, roomName }) => {
        if (username && roomName) {
            socket.username = username;
            socket.join(roomName);
        } else {
            socket.emit(REJECT_JOIN_ROOM_REQUEST, { reason: "Empty name or room name" })
        }
    });
});

//event fired when a socket connects to a room
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);

    //event only fires if sockets join a room other than its default room
    if (id !== room) {
        //notify user they have successfully joined the room
        const socket = io.sockets.sockets.get(id);
        io.to(id).emit(APPROVED_JOIN_ROOM_REQUEST, ({ roomName: room, username: socket.username }))
    }

    //notify users in room that a new user has connected
});

//event fired when a socket disconnects from a room
io.of("/").adapter.on("leave-room", (room, id) => {
    //TODO : notify users that a user has left the room
    console.log(`socket ${id} has left room ${room}`);

});

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});