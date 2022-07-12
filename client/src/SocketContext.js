import { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const URL = "ws://localhost:5000"

const SocketContext = ({ children }) => {
    //referece to websocket connection
    const socket = useRef(null);

    //provides component access to websocket instance and methods
    const SocketContextProvider = createContext();

    //constructor
    useEffect(() => {
        //creating websocket connection to server
        socket.current = io(URL);
        socket.current.on("connect", () => {
            console.log("connected to server");
        })

        const socketCurrent = socket.current;
        return () => {
            socketCurrent.close();
        }
    }, [])
    return (
        <SocketContextProvider.Provider value={socket.current}>
            {children}
        </SocketContextProvider.Provider>
    )
}




export default SocketContext;