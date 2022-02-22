import { getToken } from "next-auth/jwt"
import { executeQuery } from '../../../db'
import config from '../../../config.json'
import { delCache, setCache, getCache } from '../../../lib/cache'
import Axios from 'axios'
import { sendLog } from '../../../webhook';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: '405 Method not allowed', error: true });
    }
    const session = await getToken({
        req,
        secret: process.env.SECRET_COOKIE_PASSWORD,
        secureCookie: process.env.NEXTAUTH_URL.startsWith('https://')
    })
    //const isRateLimited = await getCache(`ratelimitsuserapi:${session.sub}`)
    //if (isRateLimited != false) {
    //    return res.status(429).json({ message: '429 Too Many Requests (RateLimited)', error: true });
    //}
    //await setCache(`ratelimitsuserapi:${session.sub}`, true, 5)
    const sqlr = await executeQuery("SELECT * FROM resources WHERE uid = ?", [session.sub]);
    if (sqlr.length !== 0) {
        return res.redirect("/");
    }
    let pterores = await Axios.post(`https://${config.panel_url}/api/application/users`, {
        "email": session.email,
        "username": session.sub,
        "first_name": session.name,
        "last_name": session.name,
        "root_admin": false
    }, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${config.panel_apikey}`
        }
    }).catch(e => { pterores = e })
    if (!pterores) return res.status(500).json({ message: '500 Internal Server Error (Pterodactyl api)', error: true });
    if (pterores && !pterores.data && pterores.response) {
        return res.status(500).json({ message: "An account with this email or username already exists, or the api key is invalid.", error: true, verbose: pterores.response.data.errors[0].detail })
    }
    const pterouid = pterores.data.attributes.id;
    const sqlres = await executeQuery("SELECT * FROM resources WHERE uid = ?", [session.sub]);
    if (sqlres === false || sqlres.length === 0) {
        const somql = await executeQuery("INSERT INTO resources (uid, cpu, memory, disk, coins, serverlimit, ptero_uid) VALUES (?, ?, ?, ?, ?, ?, ?)", [session.sub, config.packages.default.cpu, config.packages.default.memory, config.packages.default.disk, 0, config.packages.default.serverlimit, pterouid]);
        if (somql == false) {
            return res.status(500).json({ message: '500 Internal Server Error', error: true });
        }
        await sendLog("Create New User", session, `None`)
        return res.redirect("/")
    }
    await sendLog("Create New User", session, `None`)
    return res.redirect("/")
}
