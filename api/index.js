// 📁 api/index.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET — buat test
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'DikFaa API is running! Use POST with { method, key, value }' 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { method, key, value } = req.body || {};

  if (!method) {
    return res.status(400).json({ error: 'Method required (GET, SET, KEYS)' });
  }

  const UPSTASH_URL = 'https://saving-walleye-172347.upstash.io';
  const UPSTASH_TOKEN = 'gQAAAAAAAqE7AAIgcDJiMjFhOGZiOGFmODU0YzVlYjhkODZmZmUxOWU1NGEzNg';

  try {
    const url = `${UPSTASH_URL}/${key}`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    switch (method) {
      case 'GET': {
        const resUpstash = await fetch(url, options);
        const data = await resUpstash.json();
        return res.status(200).json(data ? (typeof data === 'string' ? JSON.parse(data) : data) : null);
      }

      case 'SET': {
        options.method = 'SET';
        options.body = JSON.stringify(value);
        const resUpstash = await fetch(url, options);
        await resUpstash.json();
        return res.status(200).json({ success: true });
      }

      case 'KEYS': {
        const keysRes = await fetch(`${UPSTASH_URL}/KEYS/${key}*`, options);
        const keysData = await keysRes.json();
        return res.status(200).json(keysData);
      }

      default:
        return res.status(400).json({ error: 'Method tidak dikenal. Gunakan: GET, SET, KEYS' });
    }
  } catch (error) {
    console.error('🔥 Error:', error);
    return res.status(500).json({ 
      error: 'Gagal terhubung ke database',
      detail: error.message 
    });
  }
}
