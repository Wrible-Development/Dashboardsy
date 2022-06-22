import { withIronSessionSsr, withIronSessionApiRoute } from 'iron-session/next';

const sessionOptions = {
    cookieName: "dashboardsy",
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    }
}

export function withSessionRoute(handler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
    return withIronSessionSsr(handler, sessionOptions);
}