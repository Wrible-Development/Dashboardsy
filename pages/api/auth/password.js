import { withSessionRoute } from '../../../lib/session'
import { executeQuery } from '../../../db'
import { sendMail } from '../../../lib/mail'
import crypto from 'crypto';

export default withSessionRoute(
    async function passwordRoute(req, res) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: true, message: 'Method Not Allowed' })
        }
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: true, message: 'Bad Request' })
        }
        const user = await executeQuery("SELECT * FROM users WHERE email = ?", [email])
        if (!user || user.length == 0) {
            return res.status(401).json({ error: true, message: 'An account with this email doesn\'t exist' })
        }
        const code = await crypto.randomBytes(32).toString('hex')
        await executeQuery("INSERT INTO forgetPasswordCodes (email, code) VALUES (?, ?)", [email, code])
        await sendMail(email, "Reset your password", `Hello there, someone (hopefully you) requested a password reset on ${process.env.APP_URL} with the email: ${email}.\n\nPlease reset your password using the following link: ${process.env.APP_URL}/api/auth/forgetPassword?code=${code}&email=${encodeURIComponent(email)}\n\nIf you didn't request a password reset, you can freely ignore this email.`)
        return res.status(200).json({ error: false, message: "Please check your email." });
    });
