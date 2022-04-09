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
    if (!req.body.resources || !req.body.resources.cpu || !req.body.resources.memory || !req.body.resources.disk || !req.body.resources.location || !req.body.resources.egg || !req.body.sname) {
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
    const amtofservers = await getServers(sqlres[0].uid);
    let sqlused = await executeQuery("SELECT * FROM usedresources WHERE uid = ?", [session.sub]);
    if (sqlused === false || sqlused.length === 0) {
        await executeQuery("INSERT INTO usedresources (uid, cpu, memory, disk, ptero_uid) VALUES (?, ?, ?, ?, ?)", [session.sub, 0, 0, 0, sqlres[0].ptero_uid]);
    }
    sqlused = await executeQuery("SELECT * FROM usedresources WHERE uid = ?", [session.sub]);
    const unused = {
        "cpu": sqlres[0].cpu - sqlused[0].cpu,
        "memory": sqlres[0].memory - sqlused[0].memory,
        "disk": sqlres[0].disk - sqlused[0].disk
    }
    if (unused.cpu < req.body.resources.cpu || unused.memory < req.body.resources.memory || unused.disk < req.body.resources.disk) {
        return res.status(400).json({ message: '400 Bad Request (You dont have enough resources)', error: true });
    }
    if (sqlres[0].serverlimit <= amtofservers.length) {
        return res.status(400).json({ message: '400 Bad Request (Server Limit)', error: true });
    }
    const checkIfLocExists = config.locations.find(x => x.key === req.body.resources.location);
    const egg = config.eggs.find(x => x.key === req.body.resources.egg);
    if (!checkIfLocExists || !egg) {
        return res.status(400).json({ message: '400 Bad Request', error: true });
    }
    
    const specs = {
        "name": req.body.sname,
        "user": sqlres[0].ptero_uid,
        "egg": egg.eggid,
        "docker_image": egg.docker_image,
        "startup": egg.startup,
        "environment": egg.environment,
        "skip_scripts": egg.skip_scripts,
        "oom_disabled": egg.oom_disabled,
        "limits": {
            "memory": req.body.resources.memory,
            "cpu": req.body.resources.cpu,
            "disk": req.body.resources.disk,
            "io": 500,
            "swap": -1
        },
        "feature_limits": egg.feature_limits,
        "deploy": {
            "locations": [checkIfLocExists.id],
            "dedicated_ip": false,
            "port_range": []
        },
        "start_on_completion": true
    }
    const resd = await Axios.post(`https://${config.panel_url}/api/application/servers`, JSON.stringify(specs), {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${config.panel_apikey}`
        }
    }).catch(e => console.error(e.response.data.errors));
     if (!resd) {
        return res.status(500).json({ message: 'No nodes satisfying the requirements specified for automatic deployment could be found. (No slots are available).', error: true });
    }
    if (resd.status !== 200 && resd.status !== 201) {
        return res.status(resd.status).json({ message: `${resd.status} Error!`, error: true });
    }
    const sqlrs = await executeQuery("UPDATE usedresources SET cpu = cpu + ?, memory = memory + ?, disk = disk + ? WHERE uid = ?", [req.body.resources.cpu, req.body.resources.memory, req.body.resources.disk, session.sub]);
    if (sqlrs === false) {
        await executeQuery("INSERT INTO usedresources (uid, cpu, memory, disk, ptero_uid) VALUES (?, ?, ?, ?, ?)", [session.sub, req.body.resources.cpu, req.body.resources.memory, req.body.resources.disk, sqlres.ptero_uid]);
    }
    if (config.renewal.enabled) {
        await executeQuery("INSERT INTO renewals (uid, serverid, renewaldate) VALUES (?, ?, ?)", [session.sub, resd.data.attributes.id, (new Date().getTime() + (config.renewal.daystorenewafter * 24 * 60 * 60 * 1000))]);
    }
    delCache(`servers:${session.sub}`);
    await sendLog("Create Server", session, `Server ID: ${resd.data.attributes.id}`)
    return res.status(200).json({ "message": "200 OK", error: false });
}