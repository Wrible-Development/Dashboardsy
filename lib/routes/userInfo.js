import { executeQuery } from '../../db'
import { sendLog } from '../../webhook';

export default async function getUserInfo(req, res, dmanager) {
    const sqlr = await executeQuery("SELECT * FROM resources WHERE uid = ?", [req.query.userid]);
    if (sqlr == false || sqlr.length === 0) {
        return res.status(404).json({ message: '404 User Not Found', error: true });
    }
    await sendLog("Request User Info (ADMIN API)", { "sub": req.query.userid, "name": "ADMIN API" }, dmanager ? `Dashboardsy Manager: <#${dmanager}>` : `None`)
    return res.status(200).json({ "message": "200 OK", error: false, data: {
        "userid": req.query.userid,
        "coins": sqlr[0].coins,
        "memory": sqlr[0].memory,
        "cpu": sqlr[0].cpu,
        "storage": sqlr[0].disk,
        "ptero_uid": sqlr[0].ptero_uid,
    } });
}
