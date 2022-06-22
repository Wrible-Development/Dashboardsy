import { withSessionRoute } from '../../../lib/session'

export default withSessionRoute(
    async function signoutRoute(req, res) {
        if (!req?.session?.user) return res.status(403).json({ error: true, message: 'You need to be logged in' })
        if (req.method !== "GET") return res.status(405).json({ error: true, message: "Method not allowed" })
        await req.session.destroy();
        return res.status(200).json({ error: false });
    });
