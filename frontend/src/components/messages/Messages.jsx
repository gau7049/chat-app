import React, { useCallback, useEffect, useRef, useState } from 'react'
import Message from './Message'
import useGetMessages from '../../hooks/useGetMessages'
import MessageSkeleton from '../skeletons/MessageSkeleton';
import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';

function Messages() {
  const { loading} = useGetMessages();
  const { messages, setMessages } = useConversation();
  const lastMessageRef = useRef();
  const {seenMessage} = useSocketContext();
  const safetyFlag = useRef(true)
  const [loginUserId, setLoginUserId] = useState([]);

  useEffect(() => {
      const getLoggedInUser = JSON.parse(localStorage.getItem("chat-user")); 
      if(getLoggedInUser){
        setLoginUserId(getLoggedInUser._id)
      }
    }, [])

  useEffect(() => {
    // if(safetyFlag.current){
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({behaviour : "smooth"});
      }, 100)
      if(typeof seenMessage?.messageId === "string" && seenMessage?.userId === loginUserId){
        const msgLen = messages?.length || 0;
        const msgs = messages ? [...messages] : [];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if(msgs[i]._id === seenMessage?.messageId){
            msgs[i].status = 'seen'
            setMessages(msgs)
          }
        }
      }
    // }
  },[messages?.length])

  useEffect(() => {
    
    // Only proceed if seenMessage is available and messages array has items
    if (seenMessage && messages?.length > 0) {
      // Create a shallow copy of the messages array
      const msgs = [...messages];
  
      // Check if seenMessage is an array (multiple messages to mark as seen)
      if (Array.isArray(seenMessage)) {
  
        // Loop through the last `seenMessage.length` messages and set their status to "seen"
        for (let i = msgs.length - seenMessage.length; i < msgs.length; i++) {
          msgs[i] = {
            ...msgs[i],
            status: 'seen', // Set status to seen
          };
        }
        setMessages(msgs);
      } else {
      }
  
      // Update state with the new messages
    }
  }, [seenMessage]); // Depend on both seenMessage and messages

  return (
    <div className='px-4 flex-1 overflow-auto'>

      {!loading && messages?.length > 0 && messages?.map((message) => (
        <div key={message._id} ref={lastMessageRef}>
          <Message message={message} />
        </div>
      ))}


      {loading && [...Array(3)].map((_,idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages?.length === 0 && (
          <p className='text-center text-red-50'>Send a message to start the conversation</p>
      )}
    </div>
  )
}

export default Messages