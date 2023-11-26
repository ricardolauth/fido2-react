import { createContext, useState } from "react"

type AuthContextType = {
    token: string | null
    signIn: (token: string) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({ token: null, signIn: () => { }, logout: () => { } })

interface Props {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: Props) => {
    const [token, setToken] = useState<string | null>(null)

    const handleSignIn = (token: string) => {
        setToken(token)
    }

    const handleLogout = () => {
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, signIn: handleSignIn, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}