import { withSessionRoute } from "../../../lib/session";

export default withSessionRoute(
    async function userRoute(req, res) {
        return res.status(200).json({ user: req.session.user });
    }
);
