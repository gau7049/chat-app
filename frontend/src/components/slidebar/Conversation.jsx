import React, {useState, useEffect} from 'react';
import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';
import { formatLastSeen } from '../../utils/formatLastSeen';
import boyImage from '../../../static/images/boy_img.jpg';
import girlImage from '../../../static/images/girl_img.jpg'

function Conversation({ conversation, lastIdx }) {
  const { selectedConversation, Updatedconversation, setSelectedConversation, setUpdatedConversation, toggleMobileUser, typingStatus } = useConversation();
  const { onlineUsers, socket } = useSocketContext();
  const [loginUserId, setLoginUserId] = useState(null);

  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id); // if true, user is online

  // Assuming conversation has properties for the last message and last message date
  const lastMessage = conversation.lastMessage || "No messages yet"; // Default text if no messages
  const lastMessageDate = formatLastSeen(conversation.lastMessageTime, "lastMessageDate");

  useEffect(() => {
    const getLoggedInUser = JSON.parse(localStorage.getItem("chat-user")); 
    if(getLoggedInUser){
      setLoginUserId(getLoggedInUser._id)
    }
    if(conversation?.unreadCount){
    }
  }, [])

  const truncateText = (text, length = 30) => 
    text.length > length ? `${text.slice(0, length)}...` : text;

  // Determine if there are unread messages for the user
  const unreadCountForUser = conversation?.unreadCount ? conversation?.unreadCount[loginUserId]?.length : 0
  const newMessages = conversation?.new_message || 0;

  // If there are unread messages, combine the counts
  const hasUnreadMessages = unreadCountForUser + newMessages > 0;

  // Final unread count including both unread messages and new messages
  const totalUnreadMessages = hasUnreadMessages ? unreadCountForUser + newMessages : newMessages;
  
  // const handleClickOnConversation = () => {
  //   socket.emit("conversation_open", conversation._id);
  //   if(hasUnreadMessages && conversation?.unreadCount[loginUserId] > 0){
  //     socket.emit("reset_unread_count", loginUserId);
  //     const prevConversation = [...Updatedconversation];
  //     const updatedConversation = {
  //       ...conversation,
  //       unreadCount[loginUserId]: 0,
  //     };
  //     setSelectedConversation(updatedConversation);
  //     const NewUpdateConversation = prevConversation?.map(chat => chat._id === conversation._id ? updatedConversation : chat)
  //     setUpdatedConversation(NewUpdateConversation);
  //   } else {
  //     setSelectedConversation(conversation)
  //   }
  // }

  // Check if the conversation has unread messages

  const handleClickOnConversation = () => {
    try{
      toggleMobileUser(false);
      socket?.emit("conversation_open", conversation._id);
    if (hasUnreadMessages) {
        socket?.emit("reset_unread_count", {
          conversationId: conversation._id,
          userId: loginUserId,
        });
      // Emit reset unread count
      // Create a copy of the unreadCount and update it immutably
      const updatedUnreadCount = {
        ...conversation.unreadCount,
        [loginUserId]: [],  // Set the unread count for the logged-in user to 0
      };
  
      // Create a new updated conversation object with the modified unreadCount
      const updatedConversation = {
        ...conversation,
        unreadCount: updatedUnreadCount, // Set the updated unread count
        new_message: 0
      };
      
      // Update the selected conversation
      setSelectedConversation(updatedConversation);
      
      // Create a new array of conversations by mapping over the old one and replacing the updated conversation
      const NewUpdateConversation = Updatedconversation.map(chat =>
        chat._id === conversation._id ? updatedConversation : chat
      );
      
      // Update the conversation list state
      setUpdatedConversation(NewUpdateConversation);
    } else {
      // If no unread messages or unread count is 0, just set the selected conversation
      setSelectedConversation(conversation);
    }
  } catch (error) {
  }
  };
  
  

  return (
    <>
      <div
        className={`flex gap-2 items-cente rounded pe-2 py-2 cursor-pointer user ${isSelected && 'chat-selected'}`}
        onClick={() => handleClickOnConversation()}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={conversation.gender === "male" ? boyImage : girlImage} alt="user avatar" />
            
          </div>
        </div>
        <div className="flex flex-col flex-1 relative">
          <div className="flex gap-3 justify-between">
            <p className={`font-bold ${hasUnreadMessages ? "font-bold" : "font-semibold"}`}>
              {truncateText(conversation.fullname)}
            </p>
            <span className="text-xs">{lastMessageDate}</span>
          </div>
          {/* Last Message Preview */}
          <p className={`text-sm truncate ${hasUnreadMessages ? "font-semibold unreadmsg" : ""}`}>
            {typingStatus?.senderId === conversation._id ? typingStatus?.text : truncateText(lastMessage)}
          </p>
          {/* Unread badge at the bottom right */}
          {hasUnreadMessages && (
            <span className="absolute bottom-0 right-0 bg-sky-500 text-white text-xs font-bold rounded-full w-2 h-2 flex items-center justify-center p-3"> {totalUnreadMessages}
            </span>
          )}
        </div>
      </div>
      {!lastIdx && <div className="divider my-0 py-0 h-1"></div>}
    </>
  );
}

export default Conversation;
