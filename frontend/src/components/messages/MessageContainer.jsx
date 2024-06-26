import React, { useEffect } from 'react'
import Messages from './Messages'
import MessageInput from './MessageInput'
import useConversation from '../../zustand/useConversation'
import { useAuthContext } from '../../context/AuthContext';


function MessageContainer() {
    const {selectedConversation, setSelectedConversation} = useConversation();

    useEffect(()=>{
        // cleanUp function (unmounts)
        return () => setSelectedConversation(null)
    },[])
  return (
    <div className='sm:w-[70%] flex flex-col w-screen'>
        {!selectedConversation ? 
        (
            <NoChatSelected />
        ) : (
            <>
            {/* Header */}
            <div className='bg-slate-500 px-4 py-2 mb-2 sm:mt-auto mt-[40px] w-90% md:w-[100%]'>
                <span className='label-text'>To: <span className='text-gray-900 font-blod'>{selectedConversation.fullname}</span>
                </span>
            </div>

            <Messages />
            <MessageInput />
        </>
        )
    }
    </div>
  )
}

export default MessageContainer

const NoChatSelected = () => {
    const {authUser} = useAuthContext()
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 🧑‍💻 {authUser.fullname} 💐</p>
                <p>Select a chat to start messaging</p>
            </div>

        </div>
    )
}