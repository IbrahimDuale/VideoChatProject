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
//event sent when user wants to connect to people in the room
let CALL_USER = "CALL_USER"
//event recieved when user in the room is connecting with a new user in the call
let ANSWER_CALL = "ANSWER_CALL";
//event contains callers signal data to finish connections
let CALLERS_SIGNAL_DATA = "CALLERS_SIGNAL_DATA"
//notifies users in room when a user leaves 
let USER_LEFT = "USER_LEFT";
//event fires when user sends a message
let SEND_MESSAGE = "SEND_MESSAGE";
//event fires when user recieves a new message
let RECIEVED_MESSAGE = "RECIEVED_MESSAGE";

io.on('connection', (socket) => {
    console.log('a user connected');
    //user is attempting to join a room with a chosen username
    socket.on(JOIN_ROOM_REQUEST, ({ username, roomName }) => {
        if (username && roomName) {
            socket.username = username;
            socket.roomName = roomName;
            socket.join(roomName);
        } else {
            socket.emit(REJECT_JOIN_ROOM_REQUEST, { reason: "Empty name or room name" })
        }
    });


    //user requesting webrtc connections with users in room
    socket.on(CALL_USER, ({ roomName, fromId, fromUsername }) => {
        //user did not join room through login page
        if (socket.roomName === undefined || socket.username === undefined) {
            socket.roomName = roomName;
            socket.username = fromUsername;
            socket.join(roomName);
        }
        io.to(roomName).emit(CALL_USER, { fromId, fromUsername })
    })


    //callee accepted call and sending its own data
    socket.on(ANSWER_CALL, ({ fromId, toId, fromUsername, data }) => {
        io.to(toId).emit(ANSWER_CALL, { fromId, fromUsername, data });
    })

    //caller sending signal data to callee
    socket.on(CALLERS_SIGNAL_DATA, ({ fromId, toId, data }) => {
        io.to(toId).emit(CALLERS_SIGNAL_DATA, { fromId, data });
    })

    //user sending a message to people in the room
    socket.on(SEND_MESSAGE, ({ id, username, msg, roomName }) => {
        io.to(roomName).emit(RECIEVED_MESSAGE, { id, username, msg });
    })
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
    io.to(room).emit(USER_LEFT, { id });

});

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});