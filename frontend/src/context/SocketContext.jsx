import { createContext, useEffect, useState, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { useContext } from "react";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({children}) => {
   
    const socketRef = useRef(null); // Use useRef to persist socket instance
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();
    const [lastSeen, setLastSeen] = useState("");
    const [socketLastSeen, setSocketLastSeen] = useState("")
    const [seenMessage, setSeenMessage] = useState("");
    

    useEffect(() => {
        // Only initialize socket if authUser exists and socket is not already connected
        if (authUser && !socketRef.current) {
            const socket = io("https://chat-app-prod-l3cr.onrender.com", {
                query: { userId: authUser._id },
            });
            
            socketRef.current = socket; // Store socket in ref to persist it across renders

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("status_change", (messageIds) => {
                setSeenMessage(messageIds)
            });

            socket.on("userStatusUpdate", (data) => {
                setSocketLastSeen(data)
            });

            // Clean up socket on component unmount
            return () => {
                socketRef.current.close();
                socketRef.current = null;
            };
        }

        // If user logs out, close socket connection
        if (!authUser && socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current, 
            onlineUsers, 
            lastSeen, 
            setLastSeen,
            socketLastSeen,
            setSocketLastSeen,
            seenMessage
        }}>
            {children}
        </SocketContext.Provider>
    );
};
