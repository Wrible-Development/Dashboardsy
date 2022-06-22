import { withSessionRoute } from '../../../lib/session'
import { executeQuery } from '../../../db'

export default withSessionRoute(
    async function verificationRoute(req, res) {
        if (req.method != 'GET') return res.status(405).json({ error: true, message: 'Method Not Allowed' })
        const { userid, verificationCode } = req.query
        if (!userid || !verificationCode) return res.status(400).message({ error: true, message: 'Bad Request' })
        const checkifcodeisvalid = await executeQuery("SELECT * FROM verificationCodes WHERE userid = ? AND code = ?", [userid, verificationCode])
        if (!checkifcodeisvalid || checkifcodeisvalid.length == 0) return res.status(400).message({ error: true, message: 'Bad Request' })
        await executeQuery("DELETE FROM verificationCodes WHERE userid = ? AND code = ?", [userid, verificationCode])
        await executeQuery("UPDATE users SET isverified = 1 WHERE id = ?", [userid])
        return res.redirect('/')
    }
);
