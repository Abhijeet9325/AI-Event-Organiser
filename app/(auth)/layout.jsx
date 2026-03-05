
const AuthLayout = ({ children }) => {
    return (
        <div className='flex items-center justify-center min-h-screen py-8 px-2 m-auto text-center'>
            <div className="w-full max-w-sm scale-90 md:scale-85 ">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout
