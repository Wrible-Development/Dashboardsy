import { NextResponse, NextRequest } from "next/server"

/**
 * 
 * @param {NextRequest} req 
 * @param {NextResponse} res 
 * @param {String} path 
 */

export default async function mwRedirect(req, res, path) {
    const url = req.nextUrl.clone()
    url.pathname = path
    return await res.redirect(url)
}