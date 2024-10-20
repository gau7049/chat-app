import React, {useEffect, useState} from 'react'
import useConversation from '../zustand/useConversation'
import toast from 'react-hot-toast'
import { useSocketContext } from '../context/SocketContext'

function useGetMessages() {
    const [loading, setLoading] = useState(false)
    const {messages, setMessages, selectedConversation} = useConversation()
    const { setLastSeen } = useSocketContext();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            try{
                const res = await fetch(`/api/messages/${selectedConversation._id}`);
                const data = await res.json();
                if(data.error) throw new Error(data.error);
                setMessages(data.messages);
                setLastSeen(data.lastSeen)
            } catch (error){
                toast.error(error)
            } finally{
                setLoading(false);
            }
        }
        if(selectedConversation?._id) getMessages();
    },[selectedConversation?._id, setMessages]);

    return {messages, loading}
}

export default useGetMessages