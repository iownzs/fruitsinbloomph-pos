export default function handler(req, res) {
  if (req.method === 'GET') return res.status(200).send('Webhook placeholder: tiktok');
  if (req.method === 'POST') return res.status(200).json({ ok: true, platform: 'tiktok' });
  return res.status(405).json({ error: 'Method not allowed' });
}
