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
    if (!req.body.serverid) {
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
    const amservers = await getServers(sqlres[0].uid);
    const serverdata = amservers.find(server => server.attributes.id === req.body.serverid);
    if (!serverdata) {
        return res.status(404).json({ message: 'Server Not Found', error: true });
    }
    const resd = await Axios.delete(`https://${config.panel_url}/api/application/servers/${serverdata.attributes.id}`, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${config.panel_apikey}`
        }
    })
    if (resd.status !== 200 && resd.status !== 201 && resd.status !== 204) {
        return res.status(resd.status).json({ message: `${resd.status} Error!`, error: true });
    }
    await executeQuery("UPDATE usedresources SET cpu = cpu - ?, memory = memory - ?, disk = disk - ? WHERE uid = ?", [serverdata.attributes.limits.cpu, serverdata.attributes.limits.memory, serverdata.attributes.limits.disk, session.sub]);
    delCache(`servers:${session.sub}`);
    await sendLog("Delete Server", session, `Server ID: ${req.body.serverid}`)
    return res.status(200).json({ "message": "Sucessful", error: false });
}