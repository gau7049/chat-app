import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast';

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const {authUser, setAuthUser} = useAuthContext();

    const logout = async () => {
        setLoading(true)
        try{
            const res = await fetch("api/auth/logout", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ userId: authUser._id, active: true }),
            });
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }

            localStorage.removeItem("chat-user")
            setAuthUser(null);
        } catch (error){
            toast.error(error)
        } finally {
            setLoading(false);
        }
    }

    return {loading, logout};

}

export default useLogout