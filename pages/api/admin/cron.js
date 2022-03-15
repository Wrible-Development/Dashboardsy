import { executeQuery } from '../../../db'
import config from '../../../config.json'
import Axios from 'axios';
import { sendLog } from '../../../webhook';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: '405 Method not allowed', error: true });
    }
    if (config.adminapi.enabled == false) {
        return res.status(403).json({ "message": "403 Forbidden (Disabled)", "error": true })
    }
    if (!config.adminapi.apikey) {
        return res.status(403).json({ "message": "403 Forbidden (Invalid Key set on server)", "error": true })
    }
    if (req.headers.authorization !== config.adminapi.apikey) {
        return res.status(403).json({ "message": "403 Forbidden", "error": true })
    }
    if (config.renewal.enabled == true) {
        const pterores = await Axios.get(`https://${config.panel_url}/api/application/servers?per_page=10000`, {
            headers: {
                "Authorization": `Bearer ${config.panel_apikey}`
            }
        })
        const servers = pterores.data.data
        const sqlres = JSON.parse(JSON.stringify(await executeQuery("SELECT * FROM renewals;")))
        const currentdate = new Date().getTime()
        servers.forEach(async server => {
            const serverid = server.attributes.id
            const serverownerid = server.attributes.user;
            const sqlruser = await executeQuery("SELECT * FROM resources WHERE ptero_uid = ?", [serverownerid])
            if (sqlruser.length == 0 || !sqlruser) {
                return;
            }
            const dateforrenewal = await sqlres.find(s => s.serverid == serverid).renewaldate
            if (dateforrenewal <= currentdate) {
                if (sqlruser[0].coins < config.renewal.costtorenew) {
                    if (server.attributes.suspended == false) {
                        const suspendres = await Axios.post(`https://${config.panel_url}/api/application/servers/${serverid}/suspend`, {}, {
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": `Bearer ${config.panel_apikey}`
                            }
                        }).catch(e => console.log(e.response.data.errors))
                        if (suspendres.status !== 204) {
                            console.error("Error suspending server with id: " + serverid)
                        } else {
                            await sendLog("Suspended Server", { "name": "CRON JOB", "sub": sqlruser[0].uid }, `Server ID: ${serverid}`)
                        }
                    }
                    if (config.renewal.automaticallydeleteservers) {
                        const ifdeletionexists = await executeQuery("SELECT * FROM deletions WHERE serverid = ?", [serverid])
                        if (!ifdeletionexists || ifdeletionexists.length == 0) {
                            await executeQuery("INSERT INTO deletions (uid, serverid, deletiondate) VALUES (?, ?, ?)", [sqlruser[0].uid, serverid, currentdate + (config.renewal.deleteserverafterhowmanydays * 24 * 60 * 60 * 1000)])
                        }
                    }
                    await executeQuery("UPDATE renewals SET renewaldate = ? WHERE serverid = ?", [(currentdate + (1 * 60 * 60 * 1000)), serverid])
                } else {
                    if (server.attributes.suspended == true) {
                        const unsuspendres = await Axios.post(`https://${config.panel_url}/api/application/servers/${serverid}/unsuspend`, {}, {
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": `Bearer ${config.panel_apikey}`
                            }
                        })
                        if (unsuspendres.status !== 204) {
                            console.error("Error unsuspending server with id: " + serverid)
                        }
                    }
                    await executeQuery("UPDATE resources SET coins = coins - ? WHERE uid = ?", [config.renewal.costtorenew, sqlruser[0].uid])
                    await executeQuery("UPDATE renewals SET renewaldate = ? WHERE serverid = ?", [(currentdate + (config.renewal.daystorenewafter * 24 * 60 * 60 * 1000)), serverid])
                    const sqlr = await executeQuery("SELECT * FROM deletions WHERE serverid = ?", [serverid])
                    if (sqlr || sqlr.length > 0) {
                        await executeQuery("DELETE FROM deletions WHERE serverid = ?", [serverid])
                    }
                }
            }
        })
    }
    if (config.renewal.automaticallydeleteservers == true) {
        const sqlres = await executeQuery("SELECT * FROM deletions;")
        const currentdate = new Date().getTime()
        sqlres.forEach(async s => {
            if (s.deletiondate <= currentdate) {
                const serverdata = await Axios.get(`https://${config.panel_url}/api/application/servers/${s.serverid}`,)
                const useridowner = serverdata.data.attributes.user
                const sqlruser = await executeQuery("SELECT * FROM resources WHERE ptero_uid = ?", [useridowner])
                if (sqlruser.length == 0 || !sqlruser) {
                    return;
                }
                await executeQuery("DELETE FROM deletions WHERE serverid = ?", [s.serverid])
                await executeQuery("DELETE FROM renewals WHERE serverid = ?", [s.serverid])
                await Axios.delete(`https://${config.panel_url}/api/application/servers/${s.serverid}`, {
                    headers: {
                        "Authorization": `Bearer ${config.panel_apikey}`
                    }
                })
                await sendLog("Deleted Server", { "name": "CRON JOB", "sub": sqlruser[0].uid }, `Server ID: ${s.serverid}`)
                await executeQuery("UPDATE usedresources SET cpu = cpu - ?, memory = memory - ?, disk = disk - ? WHERE uid = ?", [serverdata.attributes.limits.cpu, serverdata.attributes.limits.memory, serverdata.attributes.limits.disk, sqlruser[0].uid]);
            }
        })
    }
    if (config.earningmethods.mining.enabled && config.earningmethods.mining.nicehashAddress) {
        const workers = await Axios.get(`https://api2.nicehash.com/main/api/v2/mining/external/${config.earningmethods.mining.nicehashAddress}/rigs/activeWorkers?size=10000`)
        if (!workers) return res.status(200).json({ "message": "200 OK", error: false });
        const workersdata = workers.data.workers
        if (!workersdata || workersdata.length === 0) return res.status(200).json({ "message": "200 OK", error: false });
        await workersdata.forEach(async w => {
            const sqlr = await executeQuery("SELECT * FROM resources WHERE ptero_uid = ?", [w.rigName])
            if (sqlr.length == 0 || !sqlr) {
                return;
            }
            const hashrate = await w.speedAccepted
            let coins;

            if (w.algorithm.enumName == "DAGGERHASHIMOTO") {
                if (hashrate >= 5 && hashrate < 10) coins = config.earningmethods.mining.coinsperfiveminutes.gpu['5to10']
                if (hashrate >= 10 && hashrate < 20) coins = config.earningmethods.mining.coinsperfiveminutes.gpu['10to20']
                if (hashrate >= 20 && hashrate < 30) coins = config.earningmethods.mining.coinsperfiveminutes.gpu['20to30']
                if (hashrate >= 30 && hashrate < 40) coins = config.earningmethods.mining.coinsperfiveminutes.gpu['30to40']
                if (hashrate >= 40) coins = config.earningmethods.mining.coinsperfiveminutes.gpu['above40']
            } else if (w.algorithm.enumName == "RANDOMXMONERO") {
                if (hashrate >= 0.5 && hashrate < 1) coins = config.earningmethods.mining.coinsperfiveminutes.cpu['.5to1']
                if (hashrate >= 1 && hashrate < 2) coins = config.earningmethods.mining.coinsperfiveminutes.cpu['1to2']
                if (hashrate >= 2 && hashrate < 3) coins = config.earningmethods.mining.coinsperfiveminutes.cpu['2to3']
                if (hashrate >= 3 && hashrate < 4) coins = config.earningmethods.mining.coinsperfiveminutes.cpu['3to4']
                if (hashrate >= 4) coins = config.earningmethods.mining.coinsperfiveminutes.cpu['above4']
            }
            if (coins) {
                await executeQuery("UPDATE resources SET coins = coins + ? WHERE ptero_uid = ?", [coins, w.rigName])
                await sendLog("Mining", { "name": "CRON JOB", "sub": sqlr[0].uid }, `${w.rigName} (${sqlr[0].uid}) has mined ${hashrate} ${w.algorithm.enumName == "DAGGERHASHIMOTO" ? "MH/s (GPU)" : "kH/s (CPU)"} and earned ${coins} coins`)
            }
        })
    }
    return res.status(200).json({ "message": "200 OK", error: false });
}