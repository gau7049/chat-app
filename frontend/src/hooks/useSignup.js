import {useState} from "react"
import toast from "react-hot-toast"
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext()

    // Helper function to validate and extract subdomain
    const getSubdomain = (username) => {
        username = username.toLowerCase();
        return username.split("@")[0];
    };

    const signup = async ({fullname, username, password, confirmPassword, gender}) => {

        const subdomain = getSubdomain(username);

        setLoading(true);

        try{
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({fullname, username, password, confirmPassword, gender}),
            });

            const data = await res.json();

            if(data.error){
                throw new Error(data.error)
            }

            // localstorage
            localStorage.setItem("chat-user",JSON.stringify(data))
            // context
            setAuthUser(data);

        } catch(error){
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return {loading, signup}
}

export default useSignup;

