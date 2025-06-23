import { useContext, createContext, useState, useEffect } from "react"
import Cookies from "js-cookie";

interface TokenContextType {
    token: string | undefined,
    setcookie: (name: string, token: string, day: number) => void,
    deletecookie: (name: string) => void
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = (): TokenContextType => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error("useToken must be used within a TokenProvider");
    }
    return context;
}

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, settoken] = useState<string | undefined>();

    useEffect(() => {
        const cookieToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user="));
        const extracted = cookieToken ? cookieToken.split("=")[1] : undefined;
        settoken(extracted);

    }, [])

    const setcookie = (name: string, token: string, day: number): void => {
        settoken(token);
        Cookies.set(name, token, { expires: day, path: '/' })
    }

    const deletecookie = (name: string) => {
        Cookies.remove(name);
        settoken(undefined);
    }
    return (
        <TokenContext.Provider value={{ token, setcookie, deletecookie }}>
            {children}
        </TokenContext.Provider>
    )
}