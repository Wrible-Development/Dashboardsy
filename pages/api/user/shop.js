import { getToken } from "next-auth/jwt"
import { executeQuery } from '../../../db'
import config from '../../../config.json'
import { delCache, setCache, getCache } from '../../../lib/cache'
import { sendLog } from '../../../webhook';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '405 Method not allowed', error: true });
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
    if (!req.body.resource.quantity || !req.body.resource.name) {
        return res.status(400).json({ message: 'Invalid Data', error: true });
    }
    if (req.body.resource.name !== "memory" && req.body.resource.name !== "cpu" && req.body.resource.name !== "disk" && req.body.resource.name !== "serverlimit" || req.body.resource.quantity < 1) {
        return res.status(400).json({ message: 'Invalid Data', error: true });
    }
    const finalprice = req.body.resource.quantity*config.shop.prices[req.body.resource.name];
    const sqr = await executeQuery("SELECT * FROM resources WHERE uid = ?", [session.sub]);
    if (sqr == false || sqr.length === 0) {
        return res.status(500).json({ message: '500 Internal Server Error', error: true });
    }
    let qntity;
    if (req.body.resource.name === "serverlimit") {
        qntity = req.body.resource.quantity;
    } else {
        qntity = req.body.resource.quantity*100;
    }
    if (sqr[0].coins < finalprice) {
        return res.status(400).json({ message: 'Not Enough Coins', error: true });
    }
    const oldamt = sqr[0].coins;
    const newamt = oldamt - finalprice;
    const sqlrs = await executeQuery("UPDATE resources SET " + req.body.resource.name + " = " + req.body.resource.name + " + ?, coins = ? WHERE uid = ?", [qntity, newamt, session.sub]);
    if (sqlrs == false) {
        return res.status(500).json({ message: '500 Internal Server Error', error: true });
    }
    await sendLog("Buy Resource", session, `${qntity} of ${req.body.resource.name}`)
    return res.status(200).json({ "message": "200 OK", error: false });
}
