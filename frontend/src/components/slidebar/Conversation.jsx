// import React from 'react'
// import useConversation from '../../zustand/useConversation';
// import { useSocketContext } from '../../context/SocketContext';
// function Conversation({conversation, lastIdx, emoji}) {

//     const {selectedConversation, setSelectedConversation} = useConversation();

//     const isSelected = selectedConversation?._id === conversation._id;
//     const {onlineUsers} = useSocketContext();
//     const isOnline = onlineUsers.includes(conversation._id) // if it true means user is online
    
//   return (
//     <>
//         <div className={`flex gap-2 items-center hover:sky-500 rounded p-2 py-2 cursor-pointer
//             ${isSelected ? "sky-500" : ""}
//         `} 
//         onClick={() => setSelectedConversation(conversation)}
//         >
//             <div className={`avatar ${isOnline ? "online" : ""}`}>
//                 <div className='w-12 rounded-full'>
//                     <img src={conversation.profilePic} alt='user avatar' />
//                 </div>
//             </div>
//             <div className='flex flex-col flex-1'>
//                 <div className='flex gap-3 justify-between'>
//                     <p className='font-bold text-bg-gray-200'>{conversation.fullname}</p>
//                     <span className='text-xl'>{emoji}</span>
//                 </div>

//             </div>
//         </div>
//         { !lastIdx && <div className='divider my-0 py-0 h-1'></div>}
//     </>
//   )
// }

// export default Conversation

import React from 'react';
import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';

function Conversation({ conversation, lastIdx, emoji }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id); // if true, user is online

  // Assuming conversation has properties for the last message and last message date
  const lastMessage = conversation.lastMessage || "No messages yet"; // Default text if no messages
  const lastMessageDate = conversation.lastMessageDate 
    ? new Date(conversation.lastMessageDate).toLocaleString() 
    : ""; // Format the date if available

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-2 cursor-pointer ${
          isSelected ? "bg-sky-500" : ""
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className='w-12 rounded-full'>
            <img src={conversation.profilePic} alt='user avatar' />
          </div>
        </div>
        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold text-gray-200'>{conversation.fullname}</p>
            <span className='text-xs'>{lastMessageDate}</span>
          </div>
          {/* Last Message Preview */}
          <p className='text-gray-300 text-sm truncate'>{lastMessage}</p>
        </div>
      </div>
      {!lastIdx && <div className='divider my-0 py-0 h-1'></div>}
    </>
  );
}

export default Conversation;
