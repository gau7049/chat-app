import { useCallback, useEffect, useState } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const {
    messages,
    setMessages,
    Updatedconversation,
    selectedConversation,
    setSelectedConversation,
    setUpdatedConversation,
  } = useConversation();

  const [bannerMessage, setBannerMessage] = useState(null);
  const [msg, setMsg] = useState(null)

  let lastPlayTime = 0;
  let userInteracted = false;

  // Set user interaction flag on any click or keydown
  const setUserInteractionFlag = () => {
    if (!userInteracted) {
      userInteracted = true;
    }
  };

  document.addEventListener("click", setUserInteractionFlag);
  document.addEventListener("keydown", setUserInteractionFlag);

  const playSound = () => {
    const now = Date.now();
    if (userInteracted && now - lastPlayTime > 1000) {
      // Only play sound if user has interacted
      const sound = new Audio(notificationSound);
      sound.play().catch((error) => {
      });
      lastPlayTime = now;
    }
  };

  useEffect(() => {
    const handleNewMessage = ({ newMessage }) => {
      if (!newMessage) return;
      const { senderId } = newMessage;
      if (selectedConversation?._id === senderId) {
        setMessages([...messages, newMessage]);
      }
      setMsg(newMessage)
      changeUserList(newMessage);
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage); // Cleanup
    };
  }, [socket, messages, setMessages, Updatedconversation]);

  const handleBannerClick = useCallback(() => {
    // Open the conversation of the user who sent the message
    const { senderId } = msg
    if (selectedConversation?._id !== senderId) {
        const select = Updatedconversation?.find((chat) => chat._id === senderId)
        const filteredConversations = Updatedconversation?.filter(
          (chat) => chat._id !== senderId
        );
        const updatedConversation = {
          ...select,
          new_message: 0
        };
        setSelectedConversation(updatedConversation);
        setUpdatedConversation([updatedConversation, ...filteredConversations]);
    }
    setBannerMessage(null);
  }, [setSelectedConversation, Updatedconversation, msg]);

  const changeUserList = ({ message, senderId, createdAt }) => {
    // Only filter once
    const filteredConversations = Updatedconversation?.filter(
      (chat) => chat._id !== senderId
    );
    
    if (selectedConversation?._id === senderId) {
      const updatedConversation = {
        ...selectedConversation,
        lastMessage: message,
        lastMessageTime: createdAt,
      };
      
      setSelectedConversation(updatedConversation);
      setUpdatedConversation([updatedConversation, ...filteredConversations]);
    } else {
      playSound(); // Debounced sound playback
      const receiverChat = Updatedconversation.find(
        (chat) => chat._id === senderId
      );

      if (receiverChat) {
        const updatedReceiverChat = {
          ...receiverChat,
          lastMessage: message,
          lastMessageTime: createdAt,
          new_message: (receiverChat?.new_message || 0) + 1,
        };

        setBannerMessage(
          `New message from ${receiverChat.fullname || "a contact"}`
        );

        setUpdatedConversation([updatedReceiverChat, ...filteredConversations]);
      }
    }
  };
  
  
  
  return { bannerMessage, handleBannerClick, setBannerMessage, msg };
};

export default useListenMessages;
