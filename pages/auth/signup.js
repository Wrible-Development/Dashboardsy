import { useState } from "react"

export default function signup(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const isInvalidEmail = email == '' || !email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const isInvalidPassword = password == '' || password.length < 6;
    const isInvalidUsername = username == '' || username.length > 32 || username.includes(" ");
    const isInvalidFirstname = firstname == '' || username.length > 32;
    const isInvalidLastname = lastname == '' || username.length > 32;
    const isInvalid = isInvalidEmail || isInvalidPassword || isInvalidUsername || isInvalidFirstname || isInvalidLastname;
    const [errorMsg, setErrorMessage] = useState('')
    const [successMsg, setSuccessMessage] = useState('')
    const signUp = async (email, pass, username, firstname, lastname) => {
        return await (await fetch("/api/auth/signup", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: pass,
                username: username,
                firstname: firstname,
                lastname: lastname
            })
        })).json()
    }
    return (
        <div className="flex flex-col items-center justify-center bg-[#303136] font-sans h-screen w-full text-white">
            <div className="flex flex-col items-center justify-center p-8 md:p-12 xl:p-16 bg-[#363940] rounded-md">
                {errorMsg && (
                    <div className="errorbox">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="successbox">
                        {successMsg}
                    </div>
                )}
                {!successMsg && <>
                    <p className="text-3xl text-gray-200">Sign up</p>
                    <p className="text-xl text-gray-400">Create your account.</p>
                    <div className="form my-5 text-white flex flex-col">
                        <label htmlFor="firstname" className="text-gray-400">First Name</label>
                        <input required={true} type="text" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setFirstname(e.target.value)} placeholder="First Name" id="firstname" />
                        <label htmlFor="lastname" className="text-gray-400 mt-3">Last Name</label>
                        <input required={true} type="text" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setLastname(e.target.value)} placeholder="Last Name" id="lastname" />
                        <label htmlFor="username" className="text-gray-400 mt-3">Username</label>
                        <input required={true} type="text" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setUsername(e.target.value)} placeholder="Username (No spaces)" id="username" />
                        <label htmlFor="email" className="text-gray-400 mt-3">Email</label>
                        <input required={true} type="email" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setEmail(e.target.value)} placeholder="Email address" id="email" />
                        <label htmlFor="password" className="text-gray-400 mt-3">Password</label>
                        <input required={true} type="password" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" />
                    </div>
                    <div className="flex flex-col text-white">
                        <div>
                            <button
                                className="bg-[#3772FF] hover:bg-blue-700 text-white font-bold py-3 px-5 rounded mt-3 text-xl disabled:cursor-not-allowed disabled:bg-red-500 transition-all duration-500"
                                onClick={async () => {
                                    const wasCorrect = await signUp(email, password, username, firstname, lastname)
                                    if (wasCorrect?.error) {
                                        setSuccessMessage('')
                                        setErrorMessage(wasCorrect.message)
                                    } else {
                                        setErrorMessage('')
                                        setSuccessMessage("Please check your email and verify your account.")
                                    }
                                }}
                                disabled={isInvalid}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                    <div className="text-center flex justify-center items-center mt-6 md:mx-6 xl:mx-8">
                        <p>Already have an account? <a href="/auth/signin" className="text-blue-500 hover:text-blue-700">Sign in here</a>.</p>
                    </div>
                </>}
            </div>
        </div>
    )
}

export async function getServerSideProps({ req }) {
    return {
        props: {
            pageName: "Register"
        }
    }
}