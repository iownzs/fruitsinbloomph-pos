export default function handler(req, res) {
  if (req.method === 'GET') return res.status(200).send('Webhook placeholder: viber');
  if (req.method === 'POST') return res.status(200).json({ ok: true, platform: 'viber' });
  return res.status(405).json({ error: 'Method not allowed' });
}
