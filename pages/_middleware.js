import { NextResponse, NextRequest } from "next/server"
import mwRedirect from '../lib/mwRedirect'
/**
 * @param {NextRequest} req 
 */
export async function middleware(req) {
    if (req.url.includes("/auth") || req.url.includes("/favicon.png")) return NextResponse.next()
    /*
    const url = req.nextUrl.clone()
    url.pathname = "/api/auth/user"
    const session = await (await fetch(url.toString(), {
        method: "GET",
    })).json()
    if (!session.user) {
        return await mwRedirect(req, NextResponse, "/auth/signin")
    }
    */
    return NextResponse.next()
}