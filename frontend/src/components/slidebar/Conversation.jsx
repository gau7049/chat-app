import React from 'react';
import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';
import { formatLastSeen } from '../../utils/formatLastSeen';

function Conversation({ conversation, lastIdx, emoji }) {
  const { selectedConversation, Updatedconversation, setSelectedConversation, setUpdatedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id); // if true, user is online

  // Assuming conversation has properties for the last message and last message date
  const lastMessage = conversation.lastMessage || "No messages yet"; // Default text if no messages
  const lastMessageDate = formatLastSeen(conversation.lastMessageTime, "lastMessageDate");

  const truncateText = (text, length = 30) => 
    text.length > length ? `${text.slice(0, length)}...` : text;

  const handleClickOnConversation = () => {
    if(conversation?.unreadCount > 0){
      const filteredConversations = Updatedconversation?.filter(
        (chat) => chat._id !== conversation._id
      );
      // console.log("selected");
      const updatedConversation = {
        ...conversation,
        unreadCount: 0
      };
      setSelectedConversation(updatedConversation);
      setUpdatedConversation([updatedConversation, ...filteredConversations]);
    } else {
      setSelectedConversation(conversation)
    }
  }

  // Check if the conversation has unread messages
  const hasUnreadMessages = conversation?.unreadCount > 0;

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-2 cursor-pointer ${isSelected ? "bg-sky-500" : ""}`}
        onClick={handleClickOnConversation}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>
        <div className="flex flex-col flex-1 relative">
          <div className="flex gap-3 justify-between">
            <p className={`font-bold ${hasUnreadMessages ? "text-white" : "text-gray-200"}`}>
              {truncateText(conversation.fullname)}
            </p>
            <span className="text-xs">{lastMessageDate}</span>
          </div>
          {/* Last Message Preview */}
          <p className={`text-sm truncate ${hasUnreadMessages ? "font-semibold text-white" : "text-gray-300"}`}>
            {truncateText(lastMessage)}
          </p>
          {/* Unread badge at the bottom right */}
          {hasUnreadMessages && (
            <span className="absolute bottom-0 right-0 bg-sky-500 text-white text-xs font-bold rounded-full w-2 h-2 flex items-center justify-center p-1">
            </span>
          )}
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1"></div>}
    </>
  );
}

export default Conversation;
