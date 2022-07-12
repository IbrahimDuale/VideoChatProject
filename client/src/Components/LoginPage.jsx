import { Box, Stack, Container, Typography, TextField, Button, Paper } from "@mui/material";
import { useState, useEffect, useContext } from "react";
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
    let [formEnabled, setFormEnabled] = useState(false);
    let { isConnected } = useContext(SocketContext);
    //constructor
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
        console.log(`username: ${username} roomName: ${roomName}`)
    }

    //prop that disables the join button if the socket is not connected
    const disableButton = { disabled: true };
    if (formEnabled)
        disableButton.disabled = false;

    return (
        <Box sx={LoginPageWrapper}>
            <Container maxWidth="sm">
                <Paper elevation={1} sx={{ padding: 5 }} >
                    <Stack spacing={2}>
                        <Typography sx={Title} variant="h4" component="h1" gutterBottom>Join A Room</Typography>
                        <TextField value={username} onChange={(e) => setUsername(e.target.value)} id="username" label="Username" variant="standard" />
                        <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} mb={2} id="roomName" label="Room Name" variant="standard" />
                        <Button {...disableButton} onClick={() => handleClick(username, roomName)} variant="contained" size="large">{disableButton.disabled ? "Not Connected" : "Join"}</Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    )
}

export default LoginPage;