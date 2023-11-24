import { AuthContext } from "./AuthProvider"

interface Props {
    children: React.ReactNode
}

const Authorized = ({ children }: Props) => {
    return (
        <AuthContext.Consumer>
            {ctx => (
                <>
                    {ctx.token !== null && children}
                </>
            )}
        </AuthContext.Consumer>
    )
}

export default Authorized