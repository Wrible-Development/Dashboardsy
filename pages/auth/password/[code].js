import { useState } from "react"
import { useRouter } from 'next/router'
import { executeQuery } from '../../../db'

export default function changepass(props) {
    const router = useRouter()
    const { code } = router.query
    const [password, setPassword] = useState('')
    const isInvalidPassword = password == '' || password.length < 6;
    const isInvalid = isInvalidPassword;
    const [errorMsg, setErrorMessage] = useState('')
    const [successMsg, setSuccessMessage] = useState('')
    const changePass = async (pass) => {
        return await (await fetch("/api/auth/pass", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code,
                password: pass,
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
                    <p className="text-3xl text-gray-200">Reset your password.</p>
                    <p className="text-xl text-gray-400">Set a new password for your account.</p>
                    <div className="form my-5 text-white flex flex-col">
                        <label htmlFor="password" className="text-gray-400 mt-3">Password</label>
                        <input required={true} type="password" className="placeholder-gray-400 p-2 mt-[2px] border-1 bg-[#6a6f7c] rounded-sm" onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" />
                    </div>
                    <div className="flex flex-col text-white">
                        <div>
                            <button
                                className="bg-[#3772FF] hover:bg-blue-700 text-white font-bold py-3 px-5 rounded mt-3 text-xl disabled:cursor-not-allowed disabled:bg-red-500 transition-all duration-500"
                                onClick={async () => {
                                    const wasCorrect = await changePass(password)
                                    if (wasCorrect?.error) {
                                        setSuccessMessage('')
                                        setErrorMessage(wasCorrect.message)
                                    } else {
                                        setErrorMessage('')
                                        setSuccessMessage("Changed password.")
                                    }
                                }}
                                disabled={isInvalid}
                            >
                                Change password
                            </button>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    )
}

export async function getServerSideProps({ req, params }) {
    const { code } = params;
    if (!code) {
        return {
            notFound: true
        }
    }
    const codeExists = await executeQuery("SELECT * FROM forgetPasswordCodes WHERE code = ?", [code]);
    if (!codeExists || codeExists.length == 0) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            pageName: "Reset your password"
        }
    }
}