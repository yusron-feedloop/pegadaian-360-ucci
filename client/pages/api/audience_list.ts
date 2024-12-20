export default async function handler(req, res) {

   // Set CORS headers
   res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your specific origin if needed
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow necessary methods
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow necessary headers
 
   // Handle preflight request
   if (req.method === 'OPTIONS') {
     return res.status(204).end(); // Respond with 204 for preflight
   }
   
  let url =
    process.env.AIXP_BASE_URL +
    "/v2/audiences?attributes=nik&greaterThan=2020-12-12T00:00:00&phoneNumber=" +
    req.query.phone;
  if (req.query.hasOwnProperty("name")) {
    url =
      process.env.AIXP_BASE_URL +
      "/v2/audiences?attributes=nik&greaterThan=2020-12-12T00:00:00&namaLengkap=" +
      req.query.name;
  }
  const result = await fetch(url, {
    headers: {
      "Content-type": "application/json",
      "x-api-key": process.env.AIXP_API_KEY,
    },
  });

  try {
    const body = await result.json();

    if (body.audiences.length > 0) {
      res.status(200).json(body);
    } else {
      res.status(404).json({ error: 1, message: "Audience Not Found!" });
    }
  } catch (e) {
    res
      .status(e.response?.status || 500)
      .json({ error: 1, message: "error 500 " + e.message });
  }
}
