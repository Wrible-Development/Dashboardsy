import { withSessionRoute } from '../../../lib/session'
import { executeQuery } from '../../../db'
import argon2 from 'argon2'

export default withSessionRoute(
    async function passchangeRoute(req, res) {
        if (req.method != 'POST') return res.status(405).json({ error: true, message: 'Method Not Allowed' })
        const { code, password } = req.body
        if (!code || !password) return res.status(400).message({ error: true, message: 'Bad Request' })
        const checkifcodeisvalid = await executeQuery("SELECT * FROM forgetPasswordCodes WHERE code = ?", [code])
        const account = await executeQuery("SELECT * FROM users WHERE email = ?", [checkifcodeisvalid[0].email])
        if (!checkifcodeisvalid || checkifcodeisvalid.length == 0) return res.status(400).message({ error: true, message: 'Bad Request' })
        await executeQuery("DELETE FROM forgetPasswordCodes WHERE code = ?", [code])
        const hashedPass = await argon2.hash(password, {
            type: argon2.argon2id
        })
        await executeQuery("UPDATE users SET password = ? WHERE id = ?", [hashedPass, account[0].id])
        return res.redirect('/')
    }
);
