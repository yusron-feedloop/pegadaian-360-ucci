import { apiAixpV2 } from "../../libs/api";
import { dateTime } from "../../libs/date-time";

export default async function handler(req, res) {
    const gtTime = dateTime().startOf('month').format("YYYY-MM-DD 00:00:00");
    const ltTime = dateTime().endOf('month').format("YYYY-MM-DD 23:59:59");
    const attrs = "nama|nik|email|phoneNumber";

    const result = await apiAixpV2.get(`event/submitEskalasiTierDua?attributes=${attrs}&lessThan=${ltTime}&greaterThan=${gtTime}`);

    res.status(200).json(result.data);
}