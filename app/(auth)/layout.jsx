
const AuthLayout = ({ children }) => {
    return (
        <div className="flex items-center justify-center h-screen overflow-hidden">
            <div className="w-full max-w-sm flex justify-center scale-90 origin-center">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout
