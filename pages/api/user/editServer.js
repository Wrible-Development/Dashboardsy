import { getToken } from "next-auth/jwt"
import { executeQuery, getServers } from '../../../db'
import config from '../../../config.json'
import Axios from 'axios'
import { delCache, setCache, getCache } from '../../../lib/cache'
import { sendLog } from '../../../webhook';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '405 Method not allowed', error: true });
    }
    if (!req.body.resources || !req.body.resources.cpu || !req.body.resources.memory || !req.body.resources.disk || !req.body.serverid) {
        return res.status(400).json({ message: '400 Bad Request', error: true });
    }
    const session = await getToken({
        req,
        secret: process.env.SECRET_COOKIE_PASSWORD,
        secureCookie: process.env.NEXTAUTH_URL.startsWith('https://')
    })
    const isRateLimited = await getCache(`ratelimitsuserapi:${session.sub}`)
    if (isRateLimited != false) {
        return res.status(429).json({ message: '429 Too Many Requests (RateLimited)', error: true });
    }
    await setCache(`ratelimitsuserapi:${session.sub}`, true, 5)
    const sqlres = await executeQuery("SELECT * FROM resources WHERE uid = ?", [session.sub]);
    if (sqlres === false || sqlres.length === 0) {
        return res.status(500).json({ message: '500 Internal Server Error', error: true });
    }
    if (req.body.resources.cpu <= 0 || req.body.resources.memory <= 0 || req.body.resources.disk <= 0) {
        return res.status(400).json({ message: '400 Bad Request (You cant have 0 or less resources)', error: true });
    }
    const amservers = await getServers(sqlres[0].uid);
    const serverdata = amservers.find(server => server.attributes.id === req.body.serverid);
    if (!serverdata) {
        return res.status(404).json({ message: '404 Server Not Found', error: true });
    }
    const sqlused = await executeQuery("SELECT * FROM usedresources WHERE uid = ?", [session.sub]);
    if (sqlused === false || sqlused.length === 0) {
        return res.status(500).json({ message: '500 Internal Server Error', error: true });
    }
    const unused = {
        "cpu": sqlres[0].cpu - sqlused[0].cpu + serverdata.attributes.limits.cpu,
        "memory": sqlres[0].memory - sqlused[0].memory + serverdata.attributes.limits.memory,
        "disk": sqlres[0].disk - sqlused[0].disk + serverdata.attributes.limits.disk
    }
    if (unused.cpu < req.body.resources.cpu || unused.memory < req.body.resources.memory || unused.disk < req.body.resources.disk) {
        return res.status(400).json({ message: '400 Bad Request (You dont have enough resources)', error: true });
    }
    

    const specs = {
        "allocation": serverdata.attributes.allocation,
        "memory": req.body.resources.memory,
        "swap": serverdata.attributes.limits.swap,
        "io": 500,
        "cpu": req.body.resources.cpu,
        "disk": req.body.resources.disk,
        "feature_limits": {
            "backups": 1,
            "databases": 1
        }
    }
    const resd = await Axios.patch(`https://${config.panel_url}/api/application/servers/${serverdata.attributes.id}/build`, JSON.stringify(specs), {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${config.panel_apikey}`
        }
    })
    if (resd.status !== 200 && resd.status !== 201) {
        return res.status(resd.status).json({ message: `${resd.status} Error!`, error: true });
    }
    await executeQuery("UPDATE usedresources SET cpu = cpu - ?, memory = memory - ?, disk = disk - ? WHERE uid = ?", [serverdata.attributes.limits.cpu, serverdata.attributes.limits.memory, serverdata.attributes.limits.disk, session.sub]);
    await executeQuery("UPDATE usedresources SET cpu = cpu + ?, memory = memory + ?, disk = disk + ? WHERE uid = ?", [req.body.resources.cpu, req.body.resources.memory, req.body.resources.disk, session.sub]);
    await sendLog("Edit Server", session, `Server ID: ${req.body.serverid}`)
    return res.status(200).json({ "message": "200 OK", error: false });
}