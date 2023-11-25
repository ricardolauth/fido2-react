import { createContext, useState } from "react"

type AuthContextType = {
    token: string | null
    handleSignIn: (token: string) => void
    handleSignOut: () => void
}

export const AuthContext = createContext<AuthContextType>({ token: null, handleSignIn: () => { }, handleSignOut: () => { } })

interface Props {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: Props) => {
    const [token, setToken] = useState<string | null>(null)

    const handleSignIn = (token: string) => {
        setToken(token)
    }

    const handleSignOut = () => {
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, handleSignIn, handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
}