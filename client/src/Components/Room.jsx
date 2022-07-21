import { useEffect, useContext, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SocketContext from "../SocketContext";
import Videos from "./Videos";
import Peer from "simple-peer";
import { Button } from "@mui/material";
import Messages from './Messages';

//event sent when user wants to connect to people in the room
let CALL_USER = "CALL_USER"

//event recieved when user in the room is connecting with a new user in the call
let ANSWER_CALL = "ANSWER_CALL";

//event contains callers signal data to finish connections
let CALLERS_SIGNAL_DATA = "CALLERS_SIGNAL_DATA"

//event fires when a user left
let USER_LEFT = "USER_LEFT";

//event fires when user sends a message
let SEND_MESSAGE = "SEND_MESSAGE";

//event fires when user recieves a new message
let RECIEVED_MESSAGE = "RECIEVED_MESSAGE";

const Room = () => {
    let { roomName } = useParams();
    let [searchParams] = useSearchParams();
    let username = searchParams.get("username");

    let { isConnected, socket } = useContext(SocketContext);

    //own stream data
    let [stream, setStream] = useState(null);
    //contains data of all other users in the room
    let [users, setUsers] = useState([]);
    //contains history of all messages sent from the moment the user entered the room
    let [messages, setMessages] = useState([]);

    //constructor
    useEffect(() => {
        let gotMedia = (stream) => {
            setStream(stream);
        }
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(gotMedia).catch(() => { })
    }, [isConnected])

    useEffect(() => {
        if (isConnected && stream !== null) {
            //incase socket randomly disconnects and this useEffect gets fired again
            socket.off(CALL_USER);
            socket.off(ANSWER_CALL);
            socket.off(CALLERS_SIGNAL_DATA);
            socket.off(USER_LEFT);
            socket.off(RECIEVED_MESSAGE);

            //new user wants to connect
            socket.on(CALL_USER, ({ fromId, fromUsername }) => {
                //return if calling self
                if (fromId === socket.id)
                    return;
                //already have a connection with user
                if (users.find((user) => user.id === fromId))
                    return;
                //webrtc connections 
                let peer = new Peer({ initiator: true, stream });

                setUsers((prevUsers) => {

                    let newUsers = [...prevUsers]
                    newUsers.push({ id: fromId, username: fromUsername, peer });

                    //saves connection to callers socket id
                    return newUsers;
                });

                //sends signal data to caller via websocket
                peer.on("signal", data => {
                    socket.emit(ANSWER_CALL, { fromId: socket.id, toId: fromId, data, fromUsername: username });
                });

                //adds callers stream to there object
                peer.on("stream", stream => {
                    setUsers((prevUsers) => {
                        let newUsers = [...prevUsers];
                        let user = newUsers.find((user) => user.id === fromId);
                        user.stream = stream;

                        return newUsers;
                    })
                });


            });

            socket.on(ANSWER_CALL, ({ fromId, fromUsername, data }) => {
                //saves connection to callers socket id
                setUsers((prevUsers) => {
                    let newUsers = [...prevUsers];
                    let user = newUsers.find((u) => u.id === fromId);
                    //if user already exists signal and return
                    if (user !== undefined) {
                        user.peer.signal(data);
                        return newUsers;
                    }

                    //otherwise create new webrtc connection
                    let peer = new Peer({ stream });
                    newUsers.push({ id: fromId, username: fromUsername, peer });

                    //sending signal data to caller via websocket
                    peer.on("signal", data => {
                        socket.emit(CALLERS_SIGNAL_DATA, { fromId: socket.id, toId: fromId, data });
                    });

                    //adding callers stream to object
                    peer.on("stream", stream => {
                        setUsers((prevUsers) => {
                            let newUsers = [...prevUsers];
                            let user = newUsers.find((user) => user.id === fromId);
                            user.stream = stream;

                            return newUsers;
                        })
                    });

                    peer.signal(data);


                    return newUsers;
                });

            })

            //callers signal data
            socket.on(CALLERS_SIGNAL_DATA, ({ data, fromId }) => {
                setUsers((prevUsers) => {
                    let newUsers = [...prevUsers];
                    let user = newUsers.find((user) => user.id === fromId);
                    user.peer.signal(data);

                    return newUsers;
                })
            })

            //a user left the room
            socket.on(USER_LEFT, ({ id }) => {
                setUsers((prevUsers) => {
                    //check if connected with user
                    let user = prevUsers.find((user) => user.id === id);
                    if (user) {
                        //clean up connection
                        user.peer.destroy();
                        //user removed from state
                        return prevUsers.filter((user) => user.id !== id);
                    } else {
                        //no connection
                        return prevUsers;
                    }
                })
            })

            //message recieved from server
            socket.on(RECIEVED_MESSAGE, ({ username, msg, id }) => {
                let fromSelf = false;
                //recieved on message
                if (socket.id === id)
                    fromSelf = true;
                setMessages((prevMessages) => {
                    let newMessages = [...prevMessages];
                    newMessages.push({ fromSelf, username, message: msg, timeStamp: new Date() });
                    return newMessages;
                })


            })
        }


        //cleanup
        return () => {
            if (isConnected) {
                socket.off(CALL_USER);
                socket.off(ANSWER_CALL);
                socket.off(CALLERS_SIGNAL_DATA);
                socket.off(USER_LEFT);
                socket.off(RECIEVED_MESSAGE);
            }
        }
    }, [isConnected, stream, socket, username, users])

    //connects with users in call
    let handleConnect = () => {
        socket.emit(CALL_USER, { fromId: socket.id, roomName, fromUsername: username });
    }

    let sendMessage = (msg) => {
        socket.emit(SEND_MESSAGE, { username, id: socket.id, msg, roomName });
    }

    return (
        <div>
            <Videos users={users} me={{ id: 0, name: username, stream }} />
            <Button variant="contained" size="large" onClick={() => handleConnect()}>Connect with Users</Button>
            <Messages messages={messages} sendMessage={sendMessage} />
        </div>
    )
}

export default Room;