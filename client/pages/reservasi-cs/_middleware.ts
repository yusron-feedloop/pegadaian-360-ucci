import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) {
        return NextResponse.json('Can not authenticate')
    }

    const userId = req.nextUrl.searchParams.get('identity')
    if (!userId) {
        return NextResponse.json('Must provide identity')
    }

    try {
        // FIXME: fetch API auth Nabila
        // const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        // await timeout(1000);

        // return NextResponse.next()
        const auth = await fetch(`${process.env.ONX_ENDPOINT}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                username: process.env.ONX_USERNAME,
                password: process.env.ONX_PASSWORD,
            })
        });

        const  { accessToken }  = await auth.json();

        const timestamp = new Date().toISOString();

        const result = await fetch(`${process.env.ONX_ENDPOINT}/pegadaian/checktokenC360?timestamp=${timestamp.split('T')[0]}&userid=${userId}&token=${token}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        });

        const body = await result.json();

        return body.isValid ? NextResponse.next() : NextResponse.json({
            'message': 'Invalid token'
        });
    } catch (error) {
        return NextResponse.json('Authentication failed: ' + error.message)
    }
}