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
            setSocketConnected(true);
        })

        socket.current.on("disconnect", () => {
            setSocketConnected(false);
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