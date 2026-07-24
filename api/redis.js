import client from './_lib/redis.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { method, key, value } = req.body || {};

  if (!method) {
    return res.status(400).json({ error: 'Method required' });
  }

  try {
    let result;

    switch (method) {
      case 'GET':
        result = await client.get(key);
        return res.status(200).json(result ? JSON.parse(result) : null);

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
    return res.status(500).json({ 
      error: 'Gagal terhubung ke database',
      detail: error.message 
    });
  }
}
