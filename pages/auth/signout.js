export default function signout(props) {
    const signOut = async (opts) => {
        await (await fetch("/api/auth/signout", {
            method: 'GET'
        })).json()
        if (opts.redirect && opts.callbackUrl) {
            return window.location.href = opts.callbackUrl
        }
        return true
    }
    return (
        <div className="flex flex-col items-center justify-center bg-[#303136] font-sans h-screen w-full">
            <div className="flex flex-col items-center justify-center p-16 bg-[#363940] rounded-md">
                <p className="text-3xl text-gray-200">Sign out</p>
                <p className="text-xl text-gray-400">Are you sure that you want to sign out?</p>
                <div className="flex flex-col text-white">
                    <div>
                        <button
                            className="bg-[#3772FF] hover:bg-blue-700 text-white font-bold py-3 px-5 rounded mt-6 text-xl"
                            onClick={() => signOut({
                                redirect: true,
                                callbackUrl: "/auth/signin"
                            })}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ req }) {
    return {
        props: {
            pageName: "Log out"
        }
    }
}