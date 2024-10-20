import { createContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client"
import { useContext } from "react";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) => {
    console.log("SocketContext")
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useAuthContext();
    const [lastSeen, setLastSeen] = useState("");

    useEffect(() => {
        if(authUser){
            const socket = io("http://localhost:8000", {
                query:{
                    userId: authUser._id
                }
            });
            setSocket(socket);

            // socket.on() is used to listen to the events. can be used both on client and server side
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users)
            })

            socket.on("userStatusUpdate", (data) => {
                setLastSeen(data?.lastSeen)
            });

            return () => socket.close();
        } else {
            if(socket){
                socket.close();
                setSocket(null);
            }
        }
    },[authUser])

    return (
        <SocketContext.Provider value={{socket, onlineUsers, lastSeen, setLastSeen}}>
            {children}
        </SocketContext.Provider>
    )
}