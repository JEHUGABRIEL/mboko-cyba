// api-gateway/src/routes/tracks.js
import { Router } from 'express';
import { pool } from '../lib/db.js';
import { redisClient } from '../lib/redis.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const CACHE_TTL = 300; // 5 minutes

// GET /api/v1/tracks?page=1&limit=20&genre=Gospel&q=mabango
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, genre, q } = req.query;
    const offset = (page - 1) * limit;
    const cacheKey = `tracks:${page}:${limit}:${genre || ''}:${q || ''}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const conditions = [];
    const params = [];
    let i = 1;

    if (genre) { conditions.push(`t.genre ILIKE $${i++}`); params.push(`%${genre}%`); }
    if (q)     { conditions.push(`(t.title ILIKE $${i++} OR a.name ILIKE $${i++})`); params.push(`%${q}%`, `%${q}%`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await pool.query(`
      SELECT t.id, t.title, t.duration_s, t.genre, t.language, t.plays_count,
             a.id AS artist_id, a.name AS artist_name, a.avatar_url AS artist_avatar
      FROM tracks t
      JOIN artists a ON a.id = t.artist_id
      ${where}
      ORDER BY t.plays_count DESC
      LIMIT $${i++} OFFSET $${i}
    `, [...params, limit, offset]);

    const result = { data: rows, page: +page, limit: +limit };
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(result));
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/v1/tracks/:id/stream — retourne une URL signée MinIO pour écoute
router.get('/:id/stream', authMiddleware, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT file_path, title FROM tracks WHERE id = $1 AND is_public = true',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Titre introuvable' });

    // En dev : retourne le chemin brut
    // En prod : générer une URL présignée MinIO (expiration 1h)
    res.json({
      url: `http://minio:9000/ebia-audio/${rows[0].file_path}`,
      title: rows[0].title,
      expires_in: 3600,
    });
  } catch (err) { next(err); }
});

// POST /api/v1/tracks/:id/play — incrémente le compteur d'écoute
router.post('/:id/play', async (req, res, next) => {
  try {
    const { user_id, offline, duration_s } = req.body;
    await pool.query(
      `INSERT INTO plays (track_id, user_id, offline, duration_s)
       VALUES ($1, $2, $3, $4)`,
      [req.params.id, user_id || null, offline || false, duration_s || null]
    );
    // Incrémentation async du compteur
    await pool.query(
      'UPDATE tracks SET plays_count = plays_count + 1 WHERE id = $1',
      [req.params.id]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default router;
