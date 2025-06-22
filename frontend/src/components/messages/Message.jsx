import React, { useEffect } from 'react'
import {useAuthContext} from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation';
import { extractTime } from '../../utils/extractTime';
import { useSocketContext } from '../../context/SocketContext';

function Message({message}) {
  const {authUser} = useAuthContext();
  const {selectedConversation} =  useConversation();
  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? 'chat-end' : 'chat-start'
  // const profilePicc = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? 'bg-blue-500' : "";
  const formattedTime = extractTime(message.createdAt)
  const shakeClass = message.shouldShake ? "shake" : "";
  const {seenMessage} = useSocketContext();

  // Determine the status icon based on the message status
  const statusIcon = fromMe && (
    <span className="text-xs">
      {message.status === "seen" ? (
        <i className="fas fa-check-double text-blue-500"></i>
      ) : message.status === "delivered" ? (
        <i className="fas fa-check-double text-gray-400"></i>
      ) : (
        <i className="fas fa-check text-gray-400"></i>
      )}
    </span>
  );

  return (
    <div className={`chat ${chatClassName}`}>
        {/* <div className='chat-image avatar'>
            <div className='w-10 rounded-full'>
                <img alt="Temp" src={profilePicc} />
            </div>
        </div> */}
        <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
          {message.message}
        </div>
        <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
          {formattedTime}
          {statusIcon}
        </div>

    </div>
  )
}

export default Message