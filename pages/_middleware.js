import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import config from "../config.json";

export async function middleware(req) {
    if (config.panel_url.startsWith("http")) {
        return new Response("Panel URL should not contain https:// or http://", { status: 500 });
    }
    const session = await getToken({
        req,
        secret: process.env.SECRET_COOKIE_PASSWORD,
        secureCookie: process.env.NEXTAUTH_URL.startsWith('https://')
    })
    if (req.url.includes("/favicon.png") || req.page.name && req.page.name.includes("/favicon.png")) return NextResponse.next()
    if (req.url.includes("/api/admin") || req.page.name && req.page.name.includes("/api/admin")) return NextResponse.next()
    if (req.url.includes("/api/auth/signout") && session) return NextResponse.next()
    if (req.url.includes("/api/auth/signin") || req.page.name && req.page.name.includes("/api/auth/")) {
        if (!session) {
            return NextResponse.next()
        } else {
            return new Response("You are already logged in")
        }
    }
    if (!session) {
        const url = req.nextUrl.clone()
        url.pathname = '/api/auth/signin'
        return NextResponse.rewrite(url)
    }
    return NextResponse.next()
}