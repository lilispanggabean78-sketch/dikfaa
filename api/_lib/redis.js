import { createClient } from 'redis';

const client = createClient({
  url: 'redis://default:gQAAAAAAAqE7AAIgcDJiMjFhOGZiOGFmODU0YzVlYjhkODZmZmUxOWU1NGEzNg@saving-walleye-172347.upstash.io:6379',
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

client.on('error', (err) => console.error('Redis Client Error:', err));

// Koneksi auto pas di-import
await client.connect();

export default client;
