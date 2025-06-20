import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useConversation from '../zustand/useConversation';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false)
    const { setUpdatedConversation} = useConversation();
    const {setAuthUser}  = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try{
                const res = await fetch('/api/users');
                const data = await res.json();
                if(data.error){ // it should redirect to login (need to check)
                    localStorage.removeItem("chat-user")
                    setAuthUser(null);
                    navigate("/login");
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