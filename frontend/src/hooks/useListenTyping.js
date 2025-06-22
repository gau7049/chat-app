import { useSocketContext } from "../context/SocketContext";
import { useEffect } from "react";
import useConversation from "../zustand/useConversation";

const useListenTyping = () => {
  const { socket } = useSocketContext();
  const {
    messages,
    setMessages,
    Updatedconversation,
    selectedConversation,
    setSelectedConversation,
    setTypingStatus,
  } = useConversation();

  useEffect(() => {
    socket?.on("typing", ({ senderId }) => {
      if (selectedConversation._id === senderId) {
        setTypingStatus("typing..");
      }
    });

    socket?.on("stop_typing", ({ senderId }) => {
      setTypingStatus("");
    });

    return () => {
      socket?.off("typing");
      socket?.off("stop_typing");
    };
  }, [socket, selectedConversation]);
};

export default useListenTyping;
