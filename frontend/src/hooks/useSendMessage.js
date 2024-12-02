import React, {useState} from 'react'
import useConversation from '../zustand/useConversation'
import toast from 'react-hot-toast'

const useSendMessage =() => {
    const [loading, setLoading] = useState(false);
    const {messages, setMessages, selectedConversation} = useConversation();

    const sendMessage = async (message) => {
        setLoading(true)
        try{
            const res = await fetch(`/api/messages/send/${selectedConversation._id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message})
            })

            const data = await res.json()

            if(data.error) throw new Error(data.error)
                if(messages?.length > 0){
                    setMessages([...messages, data])
                } else {
                    const Localmessages = [];
                    Localmessages.push(data);
                    setMessages(Localmessages)
                }
            return data;
            
        } catch (error) {
            toast.error(error)
        } finally{
            setLoading(false)
        }
    }

    return {sendMessage, loading}
}

export default useSendMessage