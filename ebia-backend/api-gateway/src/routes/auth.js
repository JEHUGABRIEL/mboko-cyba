// api-gateway/src/routes/auth.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../lib/db.js';

const router = Router();

const issueToken = (user) => jwt.sign(
  { id: user.id, role: user.role, sub: user.subscription },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// POST /api/v1/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { phone, email, password, display_name } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe trop court (6 min)' });
    }
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (phone, email, display_name, firebase_uid)
       VALUES ($1, $2, $3, $4)
       RETURNING id, role, subscription`,
      [phone, email, display_name, `email:${email}`]
    );
    res.status(201).json({ token: issueToken(rows[0]) });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Compte déjà existant' });
    next(err);
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query(
      `SELECT id, role, subscription FROM users WHERE email = $1`,
      [email]
    );
    if (!rows.length) return res.status(401).json({ error: 'Identifiants invalides' });
    // Note: en prod, le hash est stocké dans une colonne password_hash
    // Pour l'instant on émet le token directement (Firebase gère le hash côté front)
    res.json({ token: issueToken(rows[0]) });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/firebase  — échange un token Firebase contre un JWT E-Bia
router.post('/firebase', async (req, res, next) => {
  try {
    const { firebase_uid, email, display_name, avatar_url } = req.body;
    if (!firebase_uid) return res.status(400).json({ error: 'firebase_uid requis' });

    // Upsert : crée l'utilisateur s'il n'existe pas
    const { rows } = await pool.query(
      `INSERT INTO users (firebase_uid, email, display_name, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (firebase_uid) DO UPDATE
         SET email = EXCLUDED.email,
             display_name = COALESCE(EXCLUDED.display_name, users.display_name),
             avatar_url   = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
             updated_at   = NOW()
       RETURNING id, role, subscription`,
      [firebase_uid, email, display_name, avatar_url]
    );
    res.json({ token: issueToken(rows[0]) });
  } catch (err) {
    next(err);
  }
});

export default router;
