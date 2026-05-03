// api-gateway/src/lib/db.js
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[POSTGRES] Client inattendu :', err.message);
});
