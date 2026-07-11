import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Cette route exécute des opérations de schéma (CREATE TABLE) et d'amorçage de données.
  // Elle ne doit jamais être accessible publiquement, même si les opérations sont
  // aujourd'hui idempotentes (IF NOT EXISTS / seed uniquement si vide).
  const adminKey = req.headers['x-admin-key'] as string;
  const expectedKey = process.env.ADMIN_PASSWORD;
  if (!expectedKey) {
    res.status(500).json({ error: 'ADMIN_PASSWORD non configuré sur le serveur' });
    return;
  }
  if (adminKey !== expectedKey) {
    res.status(401).json({ error: 'Non autorisé' });
    return;
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      res.status(500).json({ error: 'DATABASE_URL non configurée sur le serveur' });
      return;
    }

    const sql = neon(databaseUrl);

    // ── Create tables ──
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT '',
        price TEXT NOT NULL DEFAULT '',
        image TEXT NOT NULL DEFAULT '',
        images TEXT[] DEFAULT '{}',
        in_stock BOOLEAN DEFAULT true,
        description TEXT DEFAULT '',
        featured BOOLEAN DEFAULT false
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT '',
        description TEXT DEFAULT '',
        image TEXT DEFAULT '',
        images TEXT[] DEFAULT '{}',
        date TEXT DEFAULT '',
        service_id TEXT DEFAULT ''
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT DEFAULT '',
        content TEXT DEFAULT '',
        rating INTEGER DEFAULT 5,
        image TEXT DEFAULT ''
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        icon_name TEXT DEFAULT '',
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        features TEXT[] DEFAULT '{}'
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS page_content (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL DEFAULT '{}'
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL DEFAULT '{}'
      )
    `;

    // Upgrade older databases created with the previous schema.
    await sql`
      ALTER TABLE IF EXISTS projects
      ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'
    `;
    await sql`
      ALTER TABLE IF EXISTS testimonials
      ADD COLUMN IF NOT EXISTS image TEXT DEFAULT ''
    `;

    // ── Seed default data (only if tables are empty) ──
    const [productCount] = await sql`SELECT COUNT(*)::int as count FROM products`;
    if (productCount.count === 0) {
      // Products
      await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
        ('1', 'Ciment Portland CEM I 42.5R', 'Matériaux de base', '13 500 FCFA',
         'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
         ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement'],
         true, 'Ciment de haute résistance certifié, idéal pour les ouvrages en béton armé.', true),
        ('2', 'Fer à béton HA 14mm', 'Armatures', '5 200 FCFA / barre',
         'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
         ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-acier'],
         true, 'Barres d''armature à haute adhérence conformes aux normes.', true),
        ('3', 'Briques creuses 20x20x40', 'Maçonnerie', '500 FCFA / unité',
         'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique',
         ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne'],
         true, 'Briques creuses légères et résistantes pour une construction rapide.', true)`;

      // Projects
      await sql`INSERT INTO projects (id, title, category, description, image, images, date, service_id) VALUES
        ('1', 'Construction Complexe Commercial R+5', 'Bâtiment',
         'Réalisation complète d''un complexe commercial moderne au centre-ville de Bangui.',
         'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
         ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne'],
         '2024', 'construction-btp'),
        ('2', 'Rénovation Siège Administratif', 'Rénovation',
         'Rénovation complète et modernisation d''un bâtiment administratif.',
         'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
         ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne',
               'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero'],
         '2024', 'construction-btp')`;

      // Testimonials
      await sql`INSERT INTO testimonials (id, name, role, content, rating) VALUES
        ('1', 'Paul Mboko', 'Promoteur immobilier',
         'CTBA a réalisé nos fondations avec un professionnalisme remarquable.', 5),
        ('2', 'Sylvie N.', 'Directrice des Projets',
         'Nous collaborons avec CTBA sur plusieurs chantiers. Leur rigueur est exemplaire.', 5)`;

      // Services
      await sql`INSERT INTO services (id, icon_name, title, description, features) VALUES
        ('forages-hydraulique', 'Droplets', 'Forages et Hydraulique',
         'Nous facilitons l''accès à l''eau potable partout en RCA.',
         ARRAY['Réalisation de forages d''eau potable', 'Études hydrogéologiques',
               'Installation de pompes manuelles et solaires', 'Construction de châteaux d''eau']),
        ('construction-btp', 'HardHat', 'Construction et BTP',
         'Du bâtiment administratif au chantier résidentiel.',
         ARRAY['Bâtiments administratifs et résidentiels', 'Travaux de génie civil',
               'Réhabilitation et rénovation'])`;
    }

    // Page content and settings (JSONB) — always seed if missing
    const [pcCount] = await sql`SELECT COUNT(*)::int as count FROM page_content`;
    if (pcCount.count === 0) {
      await sql`INSERT INTO page_content (key, value) VALUES
        ('home', '${{
          about: { title: 'Qui sommes-nous ?', subtitle: 'À propos', paragraphs: [
            'COMPTOIR TI BE AFRICA (CTBA) est une entreprise centrafricaine spécialisée dans les travaux de forage hydraulique, la construction BTP et le commerce général.',
            'Créée pour répondre aux besoins en infrastructures et en accès à l\'eau potable en RCA.'
          ]},
          stats: [{ value: '+8', label: 'Années d\'expérience' }, { value: '+30', label: 'Projets réalisés' }, { value: '+80', label: 'Clients satisfaits' }],
          reasons: [{ icon: 'Target', title: 'Expertise professionnelle', desc: 'Une équipe d\'ingénieurs qualifiés.' }, { icon: 'ThumbsUp', title: 'Travail de qualité', desc: 'Des ouvrages durables.' }],
          values: [{ icon: 'Award', title: 'Professionnalisme', desc: 'Rigueur et compétence.' }, { icon: 'ShieldCheck', title: 'Intégrité', desc: 'Pratiques transparentes.' }]
        } as any}'::jsonb),
        ('services', '${{
          methodology: [
            { step: '01', title: 'Consultation', desc: 'Écoute de vos besoins.' },
            { step: '02', title: 'Conception', desc: 'Plans et budget détaillé.' }
          ]
        } as any}'::jsonb),
        ('contact', '${{
          openingHours: [
            { label: 'Lundi - Vendredi', hours: '08h00 - 17h00' },
            { label: 'Samedi', hours: '08h00 - 13h00' }
          ]
        } as any}'::jsonb),
        ('cta', '${{
          title: 'Prêt à démarrer votre projet ?',
          description: 'Contactez notre équipe d\'experts dès aujourd\'hui.'
        } as any}'::jsonb)`;
    }

    const [ssCount] = await sql`SELECT COUNT(*)::int as count FROM site_settings`;
    if (ssCount.count === 0) {
      await sql`INSERT INTO site_settings (key, value) VALUES
        ('contact', '${{
          phone1: '+236 72 32 06 39',
          phone2: '+236 75 72 62 44',
          email: 'contact@ctba.cf',
          address: 'Bangui, République Centrafricaine'
        } as any}'::jsonb)`;
    }

    res.status(200).json({
      success: true,
      message: 'Migration terminée avec succès. Tables créées et données initiales insérées.',
    });
  } catch (err: any) {
    console.error('Migration error:', err);
    res.status(500).json({ error: err.message || 'Erreur de migration' });
  }
}
