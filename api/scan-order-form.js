export default async function handler(req, res){
  if(req.method !== "POST"){
    return res.status(405).json({ error: "Method not allowed" });
  }

  try{
    const apiKey = process.env.GEMINI_API_KEY;

    if(!apiKey){
      return res.status(500).json({ error: "Missing GEMINI_API_KEY environment variable." });
    }

    const { text, image } = req.body || {};

    if(!text && !image){
      return res.status(400).json({ error: "No text or image provided." });
    }

    const prompt = `
You are extracting order details for a fruit/gift POS system.

Return ONLY valid JSON. No markdown. No explanation.

Rules:
- Result is a draft for staff review.
- If unknown, use empty string.
- orderType must be "Delivery" or "Pickup".
- quantity must be a number.
- Date should be YYYY-MM-DD if clear, otherwise original text.
- Time should be HH:MM if clear, otherwise original text.
- For product names, use the customer's written item name.
- itemNotes are kitchen/product customization notes, such as "change logo to Congratulations".
- cardMessage is the message written on recipient card.

JSON schema:
{
  "orderType": "",
  "customerName": "",
  "customerContact": "",
  "recipientName": "",
  "recipientContact": "",
  "deliveryAddress": "",
  "cityArea": "",
  "landmark": "",
  "deliveryDate": "",
  "deliveryTime": "",
  "deliveryType": "",
  "pickupDate": "",
  "pickupTime": "",
  "items": [
    {
      "productName": "",
      "quantity": 1
    }
  ],
  "cardMessage": "",
  "itemNotes": "",
  "paymentMethod": "",
  "confidence": "low"
}

Order text:
${text || ""}
`;

    const parts = [{ text: prompt }];

    if(image && image.base64){
      parts.push({
        inline_data: {
          mime_type: image.mimeType || "image/jpeg",
          data: image.base64
        }
      });
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts
            }
          ],
          generationConfig: {
            temperature: 0.1,
            response_mime_type: "application/json"
          }
        })
      }
    );

    const geminiData = await geminiRes.json();

    if(!geminiRes.ok){
      return res.status(500).json({
        error: geminiData.error?.message || "Gemini API error."
      });
    }

    const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed;

    try{
      parsed = JSON.parse(raw);
    }catch(error){
      return res.status(500).json({
        error: "Gemini returned invalid JSON.",
        raw
      });
    }

    return res.status(200).json({
      result: parsed
    });
  }catch(error){
    return res.status(500).json({
      error: error.message || "Smart Scan failed."
    });
  }
}
