// api-gateway/src/lib/redis.js
import { createClient } from 'redis';

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('[REDIS] :', err.message));
await redisClient.connect();

console.log('✅ Redis connecté');
