export default async function handler(req, res) {
    const result = await fetch(process.env.ROLE_AREA_CATALOG_URL, {
        headers: {
            'Content-type': 'application/json'
        }
    });

    const body = await result.json();

    res.status(200).json(body);
}