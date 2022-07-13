import { Box, Stack, Container, Typography, TextField, Button, Paper } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SocketContext from "../SocketContext";

const Title = {
    textAlign: "center",
}

const LoginPageWrapper = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
}

const LoginPage = () => {
    let [username, setUsername] = useState("");
    let [roomName, setRoomName] = useState("");
    let [isUsernameEmptyErrorFlag, setIsUsernameEmptyErrorFlag] = useState(false);
    let [isRoomNameEmptyErrorFlag, setIsRoomNameEmptyErrorFlag] = useState(false);
    let [formEnabled, setFormEnabled] = useState(false);
    let { isConnected, socket } = useContext(SocketContext);
    //navigates user to room they joined
    let navigate = useNavigate();

    /*constants representing events sent and recieved by the server and client*/
    //event sent by client when user wants to join a room
    const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
    //event sent by server when server the has added user to room
    const APPROVED_JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
    //event sent if user cannot join room
    const REJECT_JOIN_ROOM_REQUEST = "REJECT_JOIN_ROOM_REQUEST";

    //contains socket events used by the login page
    useEffect(() => {
        if (isConnected) {
            //prevents extra listeners in case of reconnections
            socket.off(APPROVED_JOIN_ROOM_REQUEST);
            socket.off(REJECT_JOIN_ROOM_REQUEST)
            socket.on(APPROVED_JOIN_ROOM_REQUEST, ({ roomName, username }) => {
                navigate(`/${roomName}?username=${username}`);
            })

            socket.on(REJECT_JOIN_ROOM_REQUEST, ({ reason }) => {
                console.log(reason);
            })

            return () => {
                socket.off(APPROVED_JOIN_ROOM_REQUEST);
                socket.off(REJECT_JOIN_ROOM_REQUEST)
            }
        }
    }, [isConnected])



    //disables of enables forms everytime the socket connects or disconnects
    useEffect(() => {
        //enable form
        if (isConnected) {
            setFormEnabled(true);
        }
        //disable form
        else {
            setFormEnabled(false);
        }
    }, [isConnected]);

    //validates username and room name and requests server to join a call
    const handleClick = function (username, roomName) {
        //TODO
        if (!username)
            setIsUsernameEmptyErrorFlag(true);
        if (!roomName)
            setIsRoomNameEmptyErrorFlag(true);
        if (username && roomName) {
            //request server to join room: roomName with name: username
            socket.emit(JOIN_ROOM_REQUEST, { username, roomName })
        }


    }

    //username textfield on change event handler
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setIsUsernameEmptyErrorFlag(false);
    }

    //room name textfield on change event handler
    const handleRoomNameChange = (e) => {
        setRoomName(e.target.value);
        setIsRoomNameEmptyErrorFlag(false);
    }

    //extra dynamic props for the join button components
    const joinButtonProp = { disabled: true };
    if (formEnabled)
        joinButtonProp.disabled = false;

    // extra props to be added for the username textfield
    let usernameProps = { error: false };
    //error field set to true if the user tried to join a room with no username provided
    if (isUsernameEmptyErrorFlag) {
        usernameProps.error = true
        usernameProps.helperText = "Username cannot be empty.";
    }

    // extra props to be added for the room name textfield
    let roomNameProps = { error: false };
    //error field set to true if the user tried to join a room with no room name provided
    if (isRoomNameEmptyErrorFlag) {
        roomNameProps.error = true
        roomNameProps.helperText = "Room name cannot be empty.";
    }

    return (
        <Box sx={LoginPageWrapper}>
            <Container maxWidth="sm">
                <Paper elevation={1} sx={{ padding: 5 }} >
                    <Stack spacing={2}>
                        <Typography sx={Title} variant="h4" component="h1" gutterBottom>Join A Room</Typography>
                        <TextField {...usernameProps} value={username} onChange={(e) => handleUsernameChange(e)} id="username" label="Username" variant="standard" />
                        <TextField {...roomNameProps} value={roomName} onChange={(e) => handleRoomNameChange(e)} mb={2} id="roomName" label="Room Name" variant="standard" />
                        <Button {...joinButtonProp} onClick={() => handleClick(username, roomName)} variant="contained" size="large">{joinButtonProp.disabled ? "Not Connected" : "Join"}</Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    )
}

export default LoginPage;