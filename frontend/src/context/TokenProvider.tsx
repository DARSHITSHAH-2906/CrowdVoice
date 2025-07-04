import { useContext, createContext, useState, useEffect } from "react"
import axios from "axios";
import { toast } from "react-toastify";

interface TokenContextType {
    token: string | null,
    deleteToken: (name: string) => void
    setToken : (token : string , name : string) => void
}

const TokenContext = createContext<TokenContextType | null>(null);

export const useToken = (): TokenContextType => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error("useToken must be used within a TokenProvider");
    }
    return context;
}

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, settoken] = useState<string | null>(null);

    useEffect(() => {
        const ValidateUser = async ()=>{
            const token = localStorage.getItem("user") ? localStorage.getItem("user") : null;
            try{
                const response = await axios.get("https://crowdvoice.onrender.com/verify-user", {
                    headers: {  
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data.message);
                settoken(token);

            }catch(error : any){
                if(error.response?.status === 401){
                    console.log("Token expired or invalid, trying to refresh...");
                    // Token expired or invalid
                    try{
                        const response = await axios.get("https://crowdvoice.onrender.com/refresh-token" , {
                            withCredentials: true,
                        });
                        console.log("Token refreshed successfully" , response.data.token);
                        setToken(response.data.token, "user");

                    }catch(err : any){
                        deleteToken("user");
                    }
                    
                }else{
                    toast.error("Backend is down. Please try again later.");
                }
            }
        }

        ValidateUser();

    }, [])

    const deleteToken = (name: string) => {
        localStorage.removeItem(name);
        settoken(null);
    }

    const setToken = (token: string, name: string) => {
        settoken(token);
        localStorage.setItem(name, token);
    }
    
    return (
        <TokenContext.Provider value={{token, deleteToken, setToken }}>
            {children}
        </TokenContext.Provider>
    )
}