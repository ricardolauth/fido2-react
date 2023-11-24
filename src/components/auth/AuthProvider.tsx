import { createContext, useState } from "react"

type AuthContextType = {
    token: Token | null
    handleSignIn: (token: Token, remember: boolean) => void
    handleSignOut: () => void
}

export const AuthContext = createContext<AuthContextType>({ token: null, handleSignIn: () => { }, handleSignOut: () => { } })

interface Props {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: Props) => {
    const [token, setToken] = useState<Token | null>(null)

    const handleSignIn = (token: Token, remember: boolean) => {
        setToken(token)
        if (remember) {
            window.sessionStorage.setItem('token', JSON.stringify(token))
        }
    }

    const handleSignOut = () => {
        setToken(null)
        window.sessionStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ token, handleSignIn, handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
}