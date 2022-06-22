import nodemailer from 'nodemailer';
import { executeQuery } from '../db'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE == "yes", // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        throw new Error(error)
    } else {
    }
});


export async function sendMail(to, subject, message, htmlmsg) {
    const config = await executeQuery("SELECT hostname FROM config");
    const res = await transporter.sendMail({
        from: {
            name: config[0].hostname,
            address: process.env.SMTP_FROM
        },
        to: to,
        subject: subject,
        text: message,
        html: htmlmsg
    })
    return true;
}