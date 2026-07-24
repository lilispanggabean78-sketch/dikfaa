import { createClient } from 'redis';

const client = createClient({
  url: 'https://saving-walleye-172347.upstash.io',
  password: 'gQAAAAAAAqE7AAIgcDJiMjFhOGZiOGFmODU0YzVlYjhkODZmZmUxOWU1NGEzNg',
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Koneksi otomatis saat di-import
client.connect().catch(console.error);

export default client;
