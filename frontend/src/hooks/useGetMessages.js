import {useEffect, useState} from 'react'
import useConversation from '../zustand/useConversation'
import toast from 'react-hot-toast'
import { useSocketContext } from '../context/SocketContext'

function useGetMessages() {
    const [loading, setLoading] = useState(false)
    const { setMessages, selectedConversation } = useConversation()
    const { setLastSeen } = useSocketContext();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            try{
                const res = await fetch(`/api/messages/${selectedConversation._id}`);
                const data = await res.json();
                if(data.error) throw new Error(data.error);
                if(data?.lastSeen){
                    setLastSeen(data.lastSeen)
                } else {
                    setLastSeen({})
                }
                setMessages(data.messages);
            } catch (error){
                toast.error(error)
            } finally{
                setLoading(false);
            }
        }
        if(selectedConversation?._id) getMessages();
    },[selectedConversation?._id]);

    return {loading}
}

export default useGetMessages