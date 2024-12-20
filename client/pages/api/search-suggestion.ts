import { apiAixpV2 } from "../../libs/api";

export default async function handler(req, res) {
    const q = req.query.q

    try {
        const response = await apiAixpV2.get(`/traits-name-suggestion?input=${q}`)

        res.status(200).json(response.data);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}