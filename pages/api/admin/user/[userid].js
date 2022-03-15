import getUserInfo from '../../../../lib/routes/userInfo';
import updateUserCoins from '../../../../lib/routes/userCoinsUpdate';
import updateUserResources from '../../../../lib/routes/userResourcesUpdate';
import config from '../../../../config.json'

export default async function handler(req, res) {
    let dmanager = false;
    if (!config.adminapi.enabled) {
        return new Response('{ "message": "403 Forbidden (Disabled)", "error": true }')
    }
    if (!config.adminapi.apikey || config.adminapi.apikey.length < 32) {
        return new Response('{ "message": "403 Forbidden (Invalid Key set on server)", "error": true }')
    }
    if (req.headers.authorization !== config.adminapi.apikey) {
        return res.status(403).json({ "message": "403 Forbidden", "error": true })
    }
    if (!req.query.userid) {
        return res.status(400).json({ message: '400 Bad Request', error: true });
    }
    if (req.query.dmanager) {
        dmanager = req.query.dmanager
    }
    switch(req.method) {
        case 'GET':
            return await getUserInfo(req, res, dmanager)
        case 'PUT':
            return await updateUserResources(req, res, dmanager)
        case 'PATCH':
            return await updateUserCoins(req, res, dmanager)
        default:
            return res.status(405).json({ message: '405 Method Not Allowed', error: true });
    }
}

