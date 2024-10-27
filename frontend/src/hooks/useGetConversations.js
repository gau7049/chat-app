import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useConversation from '../zustand/useConversation';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false)
    const { setUpdatedConversation} = useConversation();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try{
                const res = await fetch('/api/users');
                const data = await res.json();
                if(data.error){
                    throw new Error(data.error);
                }
                setUpdatedConversation(data);
            } catch (error){
                toast.error(error)
            } finally {
                setLoading(false)
            }
        }
        getConversations();
    }, []);

    return { loading }
}

export default useGetConversations