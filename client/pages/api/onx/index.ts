import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    data: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    let phoneNumber = req.query.phoneNumber as string;
    const timestamp = new Date().getTime()

    phoneNumber = `%2B${phoneNumber.replace(/\D/g,'')}`;

    try {
        const auth = await fetch(`${process.env.ONX_ENDPOINT}/auth/login`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: process.env.ONX_USERNAME,
                password: process.env.ONX_PASSWORD,
            })
        });

        const { accessToken } = await auth.json();
        const onxTicket = await fetch(`${process.env.ONX_ENDPOINT}/pegadaian/ticket?phoneNumber=${phoneNumber}&timestamp=${timestamp}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const onxTicketData = await onxTicket.json()

        res.status(200).json({ data: onxTicketData.data })
    } catch (error) {
        res.status(500).json({ data: error })
    }
}