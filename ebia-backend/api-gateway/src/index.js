// api-gateway/src/index.js
// Point d'entrée — monte tous les routers et démarre Express

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { pool } from './lib/db.js';
import { redisClient } from './lib/redis.js';
import authRouter from './routes/auth.js';
import tracksRouter from './routes/tracks.js';
import artistsRouter from './routes/artists.js';
import paymentsRouter from './routes/payments.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware globaux ────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    'https://e-bia.onrender.com',
    'http://localhost:3000',     // dev front
  ],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// ── Routes publiques ─────────────────────────────────────────
app.use('/api/v1/auth',    authRouter);
app.use('/api/v1/tracks',  tracksRouter);
app.use('/api/v1/artists', artistsRouter);

// ── Routes protégées (JWT requis) ────────────────────────────
app.use('/api/v1/payments', authMiddleware, paymentsRouter);

// ── Health check ──────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    await redisClient.ping();
    res.json({ status: 'ok', service: 'api-gateway', ts: new Date() });
  } catch (err) {
    res.status(503).json({ status: 'degraded', error: err.message });
  }
});

// ── Erreur globale ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Erreur interne' });
});

app.listen(PORT, () => {
  console.log(`🎵 E-Bia API Gateway → port ${PORT}`);
});
