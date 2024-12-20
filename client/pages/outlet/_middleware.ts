import { NextRequest, NextResponse } from 'next/server'
import { Config } from '../../libs/config'
import { fetchJson } from '../../libs/fetch'

export async function middleware(req: NextRequest) {
    const routeLogin = req.nextUrl.clone()
    routeLogin.pathname = '/login'

    const routePassion = req.nextUrl.clone();
    routePassion.pathname = '/outlet';

    if (!req.cookies.token) {
        return NextResponse.rewrite(routeLogin)
    }

    try {
        await fetchJson(`${Config.QORE_BASE_URL}/v1/user`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.cookies.token}`
            },
        })

        return NextResponse.next()
    } catch (error) {
        const response =  NextResponse.rewrite(routeLogin)
        response.clearCookie('token')
        return response
    }

}
