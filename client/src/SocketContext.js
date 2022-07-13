import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const URL = "ws://localhost:5000"

//provides component access to websocket instance and methods
const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
    //referece to websocket connection
    const socket = useRef(null);
    //set to true socket is connected to server
    let [socketConnected, setSocketConnected] = useState(false);

    //constructor
    useEffect(() => {
        //creating websocket connection to server
        socket.current = io(URL);
        socket.current.on("connect", () => {
            console.log("socket connected")
            setSocketConnected(true);
        })

        //outputs all websocket events for debugging purposes
        socket.current.onAny((event, ...args) => {
            console.log(event, args);
        });

        //emited if the socket disconnects
        socket.current.on("disconnect", (reason) => {
            console.log(`socket disconnected with reason: ${reason}`);
            setSocketConnected(false);
        })

        //emited if a low level connection cannot be established by the socket
        socket.current.on("connect_error", () => {
            console.log("low level connection error")
        })

        const socketCurrent = socket.current;
        return () => {
            socketCurrent.close();
        }
    }, [])
    return (
        <SocketContext.Provider value={{ socket: socket.current, isConnected: socketConnected }}>
            {children}
        </SocketContext.Provider>
    )
}


export default SocketContext;
export { SocketContextProvider };