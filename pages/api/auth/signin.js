import { withSessionRoute } from '../../../lib/session'
import { executeQuery } from '../../../db'
import argon2 from 'argon2'

export default withSessionRoute(
    async function loginRoute(req, res) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: true, message: 'Method Not Allowed' })
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: true, message: 'Bad Request' })
        }
        const user = await executeQuery("SELECT * FROM users WHERE email = ?", [email])
        if (!user || user.length == 0) {
            return res.status(401).json({ error: true, message: 'Invalid Credentials' })
        }
        const isPasswordCorrect = await argon2.verify(user[0].password, password, {
            type: argon2.argon2id
        })
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: true, message: 'Invalid Credentials' })
        }
        req.session.user = {
            id: user[0].id,
            isadmin: user[0].isadmin,
            discorduid: user[0].discorduid,
            name: user[0].name,
            isverified: user[0].isverified == 1
        };
        await req.session.save();
        return res.status(200).json({ error: false, message: "Logged In" });
    });
