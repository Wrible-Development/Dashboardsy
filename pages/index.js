import { getToken } from "next-auth/jwt"
import { executeQuery, getServers, getCoinsLeaderboard } from "../db"
import { Heading, Flex, Box, Button } from '@chakra-ui/react'
import Card from '../components/Card'
import useIsTouchDevice from '../lib/useIsTouchDevice'
import Table from '../components/Table'
import config from '../config.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Layout from '../components/Layout';
import useCheckAdBlocker from "../lib/useCheckAdBlocker"

export default function index(pgProps) {
    const { username, avatar, servers, uinfo, renewalservers, deletionservers, coinsleaderboard } = pgProps;
    const isMobile = useIsTouchDevice()
    const [memory, setMemory] = useState(false);
    const [disk, setDisk] = useState(false);
    const [cpu, setCpu] = useState(false);
    const [serverid, setServerid] = useState(false);
    async function editServerFunc(e) {
        e.preventDefault();
        const resources = {
            memory: memory,
            disk: disk,
            cpu: cpu
        }
        const s = await fetch("/api/user/editServer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                serverid: serverid,
                resources: resources
            })
        })
        const res = await s.json();
        if (s.status !== 200) {
            return notify("An error occurred: " + res.message, true);
        } else {
            return notify("Sucessfully edited server", false)
        }
    }
    function notify(msg, err) {
        if (err == true) {
            toast.error(msg, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } else if (err === "password") {
            toast.info(msg, {
                position: "bottom-right",
                autoClose: 30000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false
            });
        } else {
            toast.success(msg, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }
    async function createServerFunc(sname, egg, loc, disk, memory, cpu) {
        const s = await fetch("/api/user/createServer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                sname: sname,
                resources: {
                    disk: disk,
                    memory: memory,
                    cpu: cpu,
                    egg: egg,
                    location: loc,
                }
            })
        })
        const res = await s.json();
        if (s.status !== 200) {
            return notify("An error occurred: " + res.message, true);
        }
        return notify("Sucessfully created server. Please wait a while or refresh to see it here.", false)
    }
    async function buyItemFunc(event, item, quantity) {
        const s = await fetch("/api/user/shop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                resource: { name: item, quantity: quantity }
            })
        })
        const res = await s.json();
        if (s.status != 200) {
            return notify("An error occurred: " + res.message, true);
        } else {
            return notify("Sucessfully added resources!", false)
        }
    }
    async function deleteServerFunc() {
        const s = await fetch("/api/user/deleteServer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ serverid: serverid })
        })
        const res = await s.json();
        if (s.status !== 200) {
            return notify("An error occurred: " + res.message, true);
        } else {
            return notify("Server deleted successfully", false)
        }
    }
    async function regenPass() {
        const s = await fetch("/api/user/regenPass", {
            method: "GET",
        })
        const res = await s.json();
        if (s.status !== 200) {
            return notify("An error occurred: " + res.message, true);
        } else {
            return notify("Your new password is:  " + res.data.password, "password")
        }
    }
    if (config.ads.antiadblock === true) {
        const isAdBlocker = useCheckAdBlocker();
        if (isAdBlocker === true) return (
            <Box h={"100vh"} w={"100vw"}>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" m="auto" bg={"gray.700"} color="gray.100" h={"full"} w="full">
                <Heading align="center">
                    Please disable your adblocker to use this site.
                </Heading>
                <Button onClick={() => window.location.reload()} colorScheme={"gray"} mt={10}>I have disabled my adblocker!</Button>
            </Box>
            </Box>
        )
    }

    return (
        <Box bg={"gray.700"}>
            <Layout {...pgProps} buyItemFunc={buyItemFunc} regenPass={regenPass} uinfo={uinfo} createServerFunc={createServerFunc} notify={notify}>
                <Heading align="center">Howdy {username}!</Heading>
                {isMobile ? <Flex direction={"column"} justifyContent={"center"} alignItems={"center"}>
                    <Flex direction={"row"} justifyContent={"center"} alignItems={"center"}>
                        <Card property={"CPU Limit"} description={uinfo.used.cpu + "/" + uinfo.cpu} my="4" size={145} />
                        <Card property={"Memory Limit"} description={uinfo.used.memory + "/" + uinfo.memory} my="4" size={145} />
                    </Flex>
                    <Flex direction={"row"} justifyContent={"center"} alignItems={"center"}>
                        <Card property={"Disk Limit"} description={uinfo.used.disk + "/" + uinfo.disk} my="4" size={145} />
                        <Card property={"Server Limit"} description={uinfo.used.serverlimit + "/" + uinfo.serverlimit} my="4" size={145} />
                    </Flex>
                </Flex> :
                    <Flex direction={"row"} justifyContent={"center"} alignItems={"center"}>
                        <Card property={"CPU Limit"} description={uinfo.used.cpu + "/" + uinfo.cpu} my="4" size={300} />
                        <Card property={"Memory Limit"} description={uinfo.used.memory + "/" + uinfo.memory} my="4" size={300} />
                        <Card property={"Disk Limit"} description={uinfo.used.disk + "/" + uinfo.disk} my="4" size={300} />
                        <Card property={"Server Limit"} description={uinfo.used.serverlimit + "/" + uinfo.serverlimit} my="4" size={300} />
                    </Flex>
                }
                <Table data={servers.map(s => JSON.stringify({ name: s.attributes.name, id: s.attributes.id, identifier: s.attributes.identifier, limits: s.attributes.limits }))} deleteServerFunc={deleteServerFunc} uinfo={uinfo} editServerFunc={editServerFunc} setMemory={setMemory} setCpu={setCpu} setDisk={setDisk} setServerid={setServerid} renewalservers={renewalservers} deletionservers={deletionservers} />
                <ToastContainer />
            </Layout>
        </Box>
    )
}


export async function getServerSideProps({ req, res }) {
    const session = await getToken({
        req,
        secret: process.env.SECRET_COOKIE_PASSWORD,
        secureCookie: process.env.NEXTAUTH_URL.startsWith('https://')
    })
    const username = session.name;
    const avatar = session.picture;
    const sqlr = await executeQuery("SELECT * FROM resources WHERE uid = ?", [session.sub]);
    if (sqlr == false || sqlr.length == 0) {
        return {
            redirect: {
                destination: "/api/user/fixUser",
                permanent: true
            }
        }
    }
    const sqlrused = await executeQuery("SELECT * FROM usedresources WHERE uid = ?", [session.sub]);
    let usedcpu, usedmemory, useddisk;
    let usedservers;
    if (sqlrused === false || sqlrused.length === 0) {
        usedcpu = 0;
        usedmemory = 0;
        useddisk = 0;
    } else {
        usedcpu = sqlrused[0].cpu;
        usedmemory = sqlrused[0].memory;
        useddisk = sqlrused[0].disk;
    }
    const servers = await getServers(session.sub);
    const cpu = sqlr[0].cpu;
    const memory = sqlr[0].memory;
    const disk = sqlr[0].disk;
    const serverlimit = sqlr[0].serverlimit;
    usedservers = servers.length;
    const uinfo = {
        userid: session.sub,
        pterodactyluid: sqlr[0].ptero_uid,
        cpu,
        memory,
        disk,
        serverlimit,
        coins: sqlr[0].coins,
        used: {
            cpu: usedcpu,
            memory: usedmemory,
            disk: useddisk,
            serverlimit: usedservers
        },
        unused: {
            cpu: cpu - usedcpu,
            memory: memory - usedmemory,
            disk: disk - useddisk
        }
    }
    const rs = await executeQuery("SELECT * FROM renewals WHERE uid = ?", [session.sub])
    const renewalservers = rs.map(r => JSON.parse(JSON.stringify(r)))
    const ds = await executeQuery("SELECT * FROM deletions WHERE uid = ?", [session.sub])
    const deletionservers = ds.map(r => JSON.parse(JSON.stringify(r)))
    const coinsleaderboard = await getCoinsLeaderboard()
    return {
        props: { username, avatar, servers, uinfo, renewalservers, deletionservers, coinsleaderboard },
    }
}
