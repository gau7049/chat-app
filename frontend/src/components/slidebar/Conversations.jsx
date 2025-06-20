import React, { useEffect, useState } from "react";
import Conversation from "./Conversation";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import useConversation from "../../zustand/useConversation";
import useListenMessages from "../../hooks/useListenMessages";
import NotificationBanner from "../notificationBanner/NotificationBanner";
import { useSocketContext } from "../../context/SocketContext";
import { BsFillNutFill } from "react-icons/bs";

function Conversations() {
  const { loading } = useGetConversations();
  const { onlineUsers } = useSocketContext();
  const { Updatedconversation, activeOnly, setTotalActiveUser } = useConversation();
  
  const { bannerMessage, handleBannerClick, setBannerMessage, msg } =
    useListenMessages();

  // Filter conversations to include only online users if activeOnly is true
  const filteredConversations = activeOnly
    ? Updatedconversation?.filter((convo) => onlineUsers.includes(convo._id))
    : Updatedconversation;
  
  useEffect(() => {
    if(activeOnly){
      setTotalActiveUser(filteredConversations?.length)
    }
  }, [activeOnly, onlineUsers])

  return (
    <div className="py-2 flex flex-col chat-container">
      {bannerMessage && (
        <NotificationBanner
          message={bannerMessage}
          preview={msg.message}
          onClick={handleBannerClick}
          onClose={() => setBannerMessage(null)}
        />
      )}
      {loading ? (
        "Loading...."
      ) : filteredConversations?.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No users online found right now
        </div>
      ) : (
        filteredConversations?.map((conversation, idx) => {
          return (
            <Conversation
              key={conversation._id}
              conversation={conversation}
              emoji={getRandomEmoji()}
              lastIdx={idx === Updatedconversation.length - 1}
            />
          );
        })
      )}
    </div>
  );
}

export default Conversations;
