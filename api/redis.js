import client from './_lib/redis.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, key, value } = req.body || {};

  try {
    switch (method) {
      case 'GET':
        const data = await client.get(key);
        return res.status(200).json(data ? JSON.parse(data) : null);

      case 'SET':
        await client.set(key, JSON.stringify(value));
        return res.status(200).json({ success: true });

      case 'KEYS':
        const keys = await client.keys(key + '*');
        return res.status(200).json(keys);

      default:
        return res.status(400).json({ error: 'Method tidak dikenal' });
    }
  } catch (error) {
    console.error('🔥 Redis Error:', error);
    return res.status(500).json({ error: 'Gagal terhubung ke database' });
  }
}
