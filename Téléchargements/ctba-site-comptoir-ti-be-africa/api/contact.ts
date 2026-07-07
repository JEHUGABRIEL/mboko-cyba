import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { firstName, lastName, email, phone, subject, message, turnstileToken } = req.body || {};

    // Validation des champs requis
    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'Prénom, email et message sont requis' });
    }

    // Validation email simple
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Vérification Turnstile (côté serveur)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error('TURNSTILE_SECRET_KEY not set on Vercel');
      return res.status(500).json({ error: 'Erreur de configuration serveur' });
    }

    if (!turnstileToken) {
      return res.status(400).json({ error: 'Vérification anti-bot échouée' });
    }

    const verifyRes = await fetch(TURNSTILE_VERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: turnstileToken,
      }),
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      console.warn('Turnstile verification failed:', verifyData['error-codes']);
      return res.status(400).json({ error: 'Vérification anti-bot échouée. Veuillez réessayer.' });
    }

    // Stockage dans Neon
    const sql = neon(process.env.DATABASE_URL!);

    // Créer la table si elle n'existe pas (safe pour la première utilisation)
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT DEFAULT '',
        email TEXT NOT NULL,
        phone TEXT DEFAULT '',
        subject TEXT DEFAULT '',
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
      VALUES (${firstName}, ${lastName || ''}, ${email}, ${phone || ''}, ${subject || ''}, ${message})
    `;

    // Succès
    res.json({
      success: true,
      message: 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
    });

  } catch (err: any) {
    console.error('Contact API error:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
