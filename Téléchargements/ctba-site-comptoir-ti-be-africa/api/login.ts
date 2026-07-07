import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ error: 'Mot de passe requis' });
  }

  // Vérification contre la variable d'environnement (définie sur Vercel)
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD not set on Vercel');
    return res.status(500).json({ error: 'Erreur de configuration serveur' });
  }

  if (password === adminPassword) {
    // Succès : retourne le mot de passe comme token d'API
    // L'api/data.ts vérifie le header x-admin-key contre process.env.ADMIN_PASSWORD
    return res.json({ success: true, token: password });
  }

  // Échec : délai artificiel pour ralentir les attaques par force brute
  await new Promise((r) => setTimeout(r, 1000));
  return res.status(401).json({ error: 'Mot de passe incorrect' });
}
