import { withSessionRoute } from '../../../lib/session'
import { executeQuery } from '../../../db'
import argon2 from 'argon2'
import Client from '../../../lib/pterodactylClient'
import { sendMail } from '../../../lib/mail'
import crypto from 'crypto'

export default withSessionRoute(
    async function signupRoute(req, res) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: true, message: 'Method Not Allowed' })
        }
        const { email, password, username, firstname, lastname } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: true, message: 'Bad Request' })
        }
        const ifUserExists = await executeQuery("SELECT * FROM users WHERE email = ? OR username = ?", [email, username])
        if (ifUserExists.length !== 0) return res.status(400).json({ error: true, message: "Email or username has already been taken." })
        const hashedPass = await argon2.hash(password, {
            type: argon2.argon2id
        })
        const resp = await Client.post("/users", {
            "email": email,
            "username": username,
            "first_name": firstname,
            "last_name": lastname,
            "password": password
        }).catch(async err => {
            console.error(err.response.data);
            return await res.status(400).json({ error: true, message: (err?.response?.data?.errors[0].detail || "Internal Server Error") })
        })
        const pterouserid = await resp?.data?.attributes?.id
        if (!pterouserid) {
            return res.status(500).json({ error: true, message: "Internal Server Error" })
        }
        await executeQuery("INSERT INTO users (username, firstname, lastname, email, password, discorduid, credits, isadmin, pterodactyluid, isverified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [username, firstname, lastname, email, hashedPass, null, 0, false, pterouserid, 0])
        const userid = (await executeQuery("SELECT * FROM users WHERE email = ?", [email]))[0].id
        const code = await crypto.randomBytes(32).toString('hex')
        await executeQuery("INSERT INTO verificationCodes (userid, code) VALUES (?, ?)", [userid, code])
        await sendMail(email, "Verify your account", `Hello there, someone (hopefully you) registered on ${process.env.APP_URL} with the email: ${email}.\n\nPlease verify your email address using the following link: ${process.env.APP_URL}/api/auth/verification?verificationCode=${code}&userid=${userid}\n\nIf you didn't register, you can freely ignore this email.`)
        return res.status(200).json({ error: false })
    });
