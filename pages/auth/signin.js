import { useState } from "react"

export default function signin(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const isInvalidEmail = email == '' || !email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const isInvalidPassword = password == '' || password.length < 6;
    const isInvalid = isInvalidEmail || isInvalidPassword;
    const [errorMsg, setErrorMessage] = useState('')
    const [successMsg, setSuccessMessage] = useState('')
    const signIn = async(email, pass) => {
        return await (await fetch("/api/auth/signin", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: pass
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
                <p className="text-3xl text-gray-200">Sign in</p>
                <p className="text-xl text-gray-400">Sign in with your account.</p>
                <div className="form my-5 text-white flex flex-col">
                    <label htmlFor="email" className="text-gray-400">Email</label>
                    <input required={true} type="email" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setEmail(e.target.value)} placeholder="Email address" id="email" />
                    <label htmlFor="password" className="text-gray-400 mt-3">Password</label>
                    <input required={true} type="password" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" />
                </div>
                <div className="flex flex-col text-white">
                    <div>
                        <button
                            className="bg-[#3772FF] hover:bg-blue-700 text-white font-bold py-3 px-5 rounded mt-3 text-xl disabled:cursor-not-allowed disabled:bg-red-500 transition-all duration-500"
                            onClick={async() => {
                                const wasCorrect = await signIn(email, password)
                                if (wasCorrect?.error) {
                                    setErrorMessage("Invalid credentials.")
                                } else {
                                    setSuccessMessage("Sucessfully logged in.")
                                    await new Promise(r => setTimeout(r, 2000))
                                    window.location.href = "/"
                                }
                            }}
                            disabled={isInvalid}
                        >
                            Login
                        </button>
                    </div>
                </div>
                <div className="text-center flex justify-center items-center mt-6">
                    <p>Don't have an account yet? <a href="/auth/signup" className="text-blue-500 hover:text-blue-700">Sign up</a>.</p>
                </div>
                <div className="text-center flex justify-center items-center mt-1">
                    <p>Had a memory loss? Reset your password <a href="/auth/password" className="text-blue-500 hover:text-blue-700">here</a>.</p>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req }) {
    return {
        props: {
            pageName: "Login"
        }
    }
}