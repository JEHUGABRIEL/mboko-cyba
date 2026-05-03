// api-gateway/src/routes/artists.js
import { Router } from 'express';
import { pool } from '../lib/db.js';
import { redisClient } from '../lib/redis.js';

const router = Router();

// GET /api/v1/artists
router.get('/', async (req, res, next) => {
  try {
    const cached = await redisClient.get('artists:all');
    if (cached) return res.json(JSON.parse(cached));

    const { rows } = await pool.query(`
      SELECT a.id, a.slug, a.name, a.bio, a.genre, a.city, a.avatar_url,
             a.cover_url, a.verified, a.followers_count, a.plays_count,
             COUNT(t.id) AS tracks_count
      FROM artists a
      LEFT JOIN tracks t ON t.artist_id = a.id
      GROUP BY a.id
      ORDER BY a.plays_count DESC
    `);

    const result = { data: rows, total: rows.length };
    await redisClient.setEx('artists:all', 600, JSON.stringify(result));
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/v1/artists/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, COUNT(t.id) AS tracks_count
       FROM artists a
       LEFT JOIN tracks t ON t.artist_id = a.id
       WHERE a.slug = $1
       GROUP BY a.id`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Artiste introuvable' });

    const artist = rows[0];
    const { rows: tracks } = await pool.query(
      `SELECT id, title, duration_s, genre, plays_count
       FROM tracks WHERE artist_id = $1 AND is_public = true
       ORDER BY plays_count DESC`,
      [artist.id]
    );
    res.json({ ...artist, tracks });
  } catch (err) { next(err); }
});

export default router;
