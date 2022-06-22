import { useState } from "react"

export default function passwordreset(props) {
    const [email, setEmail] = useState('')
    const isInvalidEmail = email == '' || !email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const isInvalid = isInvalidEmail
    const [errorMsg, setErrorMessage] = useState('')
    const [successMsg, setSuccessMessage] = useState('')
    const resetPassword = async (email) => {
        return await (await fetch("/api/auth/password", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
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
                <p className="text-3xl text-gray-200">Forget password</p>
                <p className="text-xl text-gray-400">Reset your password.</p>
                <div className="form my-5 text-white flex flex-col">
                    <label htmlFor="email" className="text-gray-400">Email</label>
                    <input required={true} type="email" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setEmail(e.target.value)} placeholder="Email address" id="email" />
                </div>
                <div className="flex flex-col text-white">
                    <div>
                        <button
                            className="bg-[#3772FF] hover:bg-blue-700 text-white font-bold py-3 px-5 rounded mt-3 text-xl disabled:cursor-not-allowed disabled:bg-red-500 transition-all duration-500"
                            onClick={async () => {
                                const wasCorrect = await resetPassword(email)
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
                            Reset password
                        </button>
                    </div>
                </div>
                <div className="text-center flex justify-center items-center mt-6">
                    <p>Remembered your password? Login <a href="/auth/signin" className="text-blue-500 hover:text-blue-700">here</a>.</p>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req }) {
    return {
        props: {
            pageName: "Forget Password"
        }
    }
}
