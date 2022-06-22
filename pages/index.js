import { executeQuery } from "../db"
import React, { useState } from 'react';
import useCheckAdBlocker from "../hooks/useCheckAdBlocker"
import ResourceBox from '../components/ResourceBox'
import Navbar from '../components/Navbar'
import useTheme from '../hooks/useTheme'
import ServersTable from '../components/ServersTable'
import GoogleAd from '../components/GoogleAd'
import { withSessionSsr } from '../lib/session'

export default function index({ user, config, userInfo }) {
    const [theme, setTheme] = useTheme();
    if (config.antiadblock == true || config.antiadblock == 1) {
        const isAdBlocker = useCheckAdBlocker();
        if (isAdBlocker === true) return (
            <div className="h-screen w-full flex justify-center items-center text-center bg-black flex-col">
                <div>
                    <h1 className="text-white text-3xl my-2">Adblocker detected</h1>
                    <h2 className="text-white text-2xl my-2">Please disable your adblocker and reload the page</h2>
                    <button onClick={() => window.location.reload()} className="bg-[#5865F2] hover:bg-blue-700 text-white font-bold py-3 px-5 rounded mt-6 text-xl">Reload</button>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full flex text-center bg-white dark:bg-[#33404d] flex-col text-gray-900 dark:text-white">
            {user.isverified ? <div className="flex flex-row px-6 py-4 lg:px-8 xl:px-12 2xl:px-14 justify-center">
                Please check your email and verify your account
            </div> : null
            }
            <Navbar theme={theme} setTheme={setTheme} isDark={theme == "dark"} config={config} user={user} />
            <div className="resources grid grid-cols-2 md:grid-cols-3 mt-8 mx-2 md:mx-5 xl:mx-6 3xl:mx-10">
                <ResourceBox name="Total credits" value={`${userInfo.credits} Credits`} />
                <ResourceBox name="Cost per day" value={"500 Credits"} />
                <div className="col-span-2 md:col-auto">
                    <ResourceBox name="Servers" value={"10"} />
                </div>
            </div>
            <div className="mt-8 mx-2 md:mx-5 xl:mx-6 3xl:mx-10">
                <ServersTable />
            </div>
            {config.adsenseclient && config.adsenseslot && <GoogleAd slot={config.adsenseslot} client={config.adsenseclient} />}
        </div>
    )
}

export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {
        const user = req?.session?.user;
        const rawCfg = await executeQuery("SELECT hostname, adsenseclient, adsenseslot, antiadblock FROM config;")
        if (!rawCfg || rawCfg.length == 0) {
            if (user?.isadmin) {
                return {
                    redirect: {
                        permanent: false,
                        destination: "/admin/"
                    }
                }
            } else {
                return {
                    notFound: true
                }
            }
        }
        const config = JSON.parse(JSON.stringify(rawCfg[0]))
        const userInfo = JSON.parse(JSON.stringify((await executeQuery("SELECT credits FROM users WHERE id = ?;", [user.id]))[0]))
        return {
            props: {
                user: user || null,
                config: config,
                pageName: "Home",
                userInfo: userInfo
            }
        }
    }
) 