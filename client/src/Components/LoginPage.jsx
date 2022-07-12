import { Box, Stack, Container, Typography, TextField, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
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
    //constructor
    useEffect(() => {
        //TODO
    }, []);

    //validates username and room name and requests server to join a call
    const handleClick = function (username, roomName) {
        //TODO
        console.log(`username: ${username} roomName: ${roomName}`)
    }
    return (
        <Box sx={LoginPageWrapper}>
            <Container maxWidth="sm">
                <Paper elevation={1} sx={{ padding: 5 }} >
                    <Stack spacing={2}>
                        <Typography sx={Title} variant="h4" component="h1" gutterBottom>Join A Room</Typography>
                        <TextField value={username} onChange={(e) => setUsername(e.target.value)} id="username" label="Username" variant="standard" />
                        <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} mb={2} id="roomName" label="Room Name" variant="standard" />
                        <Button onClick={() => handleClick(username, roomName)} variant="contained" size="large">Join</Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    )
}

export default LoginPage;