// Migration script — run with: node scripts/migrate.mjs
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load DATABASE_URL from .env
const envPath = resolve(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const match = envContent.match(/^DATABASE_URL=(.+)$/m);
if (!match) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}
const DATABASE_URL = match[1].trim();

const sql = neon(DATABASE_URL);

async function migrate() {
  console.log('🚀 Starting Neon migration...\n');

  // ── Create tables ──
  console.log('📦 Creating tables...');

  await sql`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    price TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    images TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    description TEXT DEFAULT '',
    featured BOOLEAN DEFAULT false
  )`;
  console.log('  ✅ products');

  await sql`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    date TEXT DEFAULT '',
    service_id TEXT DEFAULT ''
  )`;
  console.log('  ✅ projects');

  await sql`CREATE TABLE IF NOT EXISTS testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    content TEXT DEFAULT '',
    rating INTEGER DEFAULT 5,
    image TEXT DEFAULT ''
  )`;
  console.log('  ✅ testimonials');

  await sql`CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    icon_name TEXT DEFAULT '',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    features TEXT[] DEFAULT '{}'
  )`;
  console.log('  ✅ services');

  await sql`CREATE TABLE IF NOT EXISTS page_content (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'
  )`;
  console.log('  ✅ page_content');

  await sql`CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'
  )`;
  console.log('  ✅ site_settings\n');

  // ── Seed data ──
  const [productCount] = await sql`SELECT COUNT(*)::int as count FROM products`;

  if (productCount.count === 0) {
    console.log('🌱 Seeding data...');

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('1', 'Ciment Portland CEM I 42.5R', 'Matériaux de base', '13 500 FCFA',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement'],
       true, 'Ciment de haute résistance certifié, idéal pour les ouvrages en béton armé et les infrastructures exigeantes.', true)`;
    console.log('  ✅ products seeded');

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('2', 'Fer à béton HA 14mm', 'Armatures', '5 200 FCFA / barre',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-acier'],
       true, 'Barres d''armature à haute adhérence conformes aux normes pour le renforcement de vos structures en béton.', true)`;

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('3', 'Briques creuses 20x20x40', 'Maçonnerie', '500 FCFA / unité',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne'],
       true, 'Briques creuses légères et résistantes pour une construction rapide et économique.', true)`;

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('4', 'Sable fin lavé', 'Agrégats', '16 000 FCFA / m³',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique'],
       true, 'Sable fin de qualité pour enduits, crépis et mortiers de finition.', false)`;

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('5', 'Gravier concassé 15/25', 'Agrégats', '27 000 FCFA / m³',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement'],
       true, 'Gravier concassé propre pour la fabrication de béton de structure.', false)`;

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('6', 'Tôles bac acier 0.5mm', 'Couverture', '7 200 FCFA / ml',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/toiture',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/toiture',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne'],
       true, 'Tôles de couverture en acier galvanisé, durables et résistantes aux intempéries.', false)`;

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('7', 'Pompe à motricité humaine (PMH)', 'Hydraulique', 'Sur devis',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/reservoir-eau',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route'],
       true, 'Pompe manuelle robuste pour forages, idéale pour l''approvisionnement en eau potable.', false)`;

    await sql`INSERT INTO products (id, name, category, price, image, images, in_stock, description, featured) VALUES
      ('8', 'Château d''eau polyéthylène 5000L', 'Hydraulique', 'Sur devis',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/reservoir-eau',
       ARRAY['https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/reservoir-eau',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route',
             'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement'],
       true, 'Réservoir de stockage d''eau en polyéthylène haute densité.', false)`;
    console.log('  ✅ all 8 products seeded');

    await sql`INSERT INTO projects (id, title, category, description, image, date, service_id) VALUES
      ('1', 'Construction Complexe Commercial R+5', 'Bâtiment',
       'Réalisation complète d''un complexe commercial moderne au centre-ville de Bangui, avec bureaux et espaces de vente.',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
       '2024', 'construction-btp')`;
    await sql`INSERT INTO projects (id, title, category, description, image, date, service_id) VALUES
      ('2', 'Rénovation Siège Administratif', 'Rénovation',
       'Rénovation complète et modernisation d''un bâtiment administratif avec mise aux normes et extension.',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
       '2024', 'construction-btp')`;
    await sql`INSERT INTO projects (id, title, category, description, image, date, service_id) VALUES
      ('3', 'Aménagement Rue Principale', 'Travaux Publics',
       'Aménagement et bitumage de la voirie urbaine avec système de drainage et trottoirs.',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route',
       '2023', 'construction-btp')`;
    await sql`INSERT INTO projects (id, title, category, description, image, date, service_id) VALUES
      ('4', 'Forage et Adduction d''Eau Potable', 'Hydraulique',
       'Étude hydrogéologique, forage et installation d''une pompe solaire avec château d''eau pour desservir une communauté rurale.',
       'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau',
       '2024', 'forages-hydraulique')`;
    console.log('  ✅ all projects seeded');

    await sql`INSERT INTO testimonials (id, name, role, content, rating) VALUES
      ('1', 'Paul Mboko', 'Promoteur immobilier',
       'CTBA a réalisé nos fondations avec un professionnalisme remarquable. L''équipe est compétente et les délais ont été tenus.', 5)`;
    await sql`INSERT INTO testimonials (id, name, role, content, rating) VALUES
      ('2', 'Sylvie N.', 'Directrice des Projets',
       'Nous collaborons avec CTBA sur plusieurs chantiers. Leur rigueur et leur savoir-faire en génie civil sont exemplaires.', 5)`;
    await sql`INSERT INTO testimonials (id, name, role, content, rating) VALUES
      ('3', 'Thierry K.', 'Ingénieur en chef',
       'Une entreprise centrafricaine de confiance qui maîtrise parfaitement les normes de construction modernes.', 4)`;
    await sql`INSERT INTO testimonials (id, name, role, content, rating) VALUES
      ('4', 'Odette G.', 'Responsable ONG, accès à l''eau',
       'CTBA a réalisé plusieurs forages pour nos communautés. Un travail sérieux, des points d''eau fiables et une équipe très à l''écoute.', 5)`;
    console.log('  ✅ all testimonials seeded');

    await sql`INSERT INTO services (id, icon_name, title, description, features) VALUES
      ('forages-hydraulique', 'Droplets', 'Forages et Hydraulique',
       'Nous facilitons l''accès à l''eau potable partout en République Centrafricaine : études, forage, équipement et maintenance, pour des points d''eau fiables et durables.',
       ARRAY['Réalisation de forages d''eau potable', 'Études hydrogéologiques',
             'Installation de pompes manuelles et solaires', 'Construction de châteaux d''eau',
             'Systèmes d''adduction d''eau potable', 'Réhabilitation et maintenance des forages'])`;
    await sql`INSERT INTO services (id, icon_name, title, description, features) VALUES
      ('construction-btp', 'HardHat', 'Construction et BTP',
       'Du bâtiment administratif au chantier résidentiel, nous menons vos travaux de construction et de génie civil avec rigueur.',
       ARRAY['Bâtiments administratifs et résidentiels', 'Travaux de génie civil',
             'Réhabilitation et rénovation', 'Maçonnerie, plomberie, électricité',
             'Aménagements et infrastructures diverses'])`;
    await sql`INSERT INTO services (id, icon_name, title, description, features) VALUES
      ('commerce-general', 'Package', 'Commerce Général',
       'Nous importons et distribuons les matériaux et équipements dont vos chantiers ont besoin.',
       ARRAY['Import-export de marchandises diverses', 'Fourniture de matériels de construction',
             'Fourniture d''équipements techniques et industriels', 'Distribution de produits divers'])`;
    console.log('  ✅ all services seeded');

    // Page content
    await sql`INSERT INTO page_content (key, value) VALUES ('home', ${
      JSON.stringify({
        about: { title: 'Qui sommes-nous ?', subtitle: 'À propos', paragraphs: [
          'COMPTOIR TI BE AFRICA (CTBA) est une entreprise centrafricaine spécialisée dans les travaux de forage hydraulique, la construction de bâtiments et travaux publics (BTP), ainsi que le commerce général.',
          "Créée pour répondre aux besoins croissants en infrastructures et en accès à l'eau potable en République Centrafricaine, nous mettons notre expertise technique au service des institutions publiques, ONG, organisations internationales, entreprises privées et particuliers.",
          'Que vous soyez un particulier, une entreprise ou une institution, nous vous accompagnons avec professionnalisme, transparence et rigueur, du premier échange à la livraison de votre projet.',
        ]},
        stats: [
          { value: '+8', label: "Années d'expérience" },
          { value: '+30', label: 'Projets réalisés' },
          { value: '+80', label: 'Clients satisfaits' },
        ],
        reasons: [
          { icon: 'Target', title: 'Expertise professionnelle', desc: "Une équipe d'ingénieurs et techniciens centrafricains hautement qualifiés." },
          { icon: 'ThumbsUp', title: 'Travail de qualité', desc: 'Des ouvrages durables et des finitions soignées.' },
          { icon: 'Clock', title: 'Respect des délais', desc: 'Livraison de vos projets dans les temps impartis.' },
          { icon: 'CheckCircle2', title: 'Solutions adaptées', desc: 'Des réponses sur mesure selon vos besoins et votre budget.' },
        ],
        values: [
          { icon: 'Award', title: 'Professionnalisme', desc: 'Rigueur et compétence dans chaque projet, de la conception à la livraison.' },
          { icon: 'ShieldCheck', title: 'Intégrité', desc: "Des pratiques transparentes et honnêtes, sans compromis sur l'éthique." },
          { icon: 'Eye', title: 'Transparence', desc: 'Communication claire et reporting régulier pour vous tenir informé.' },
          { icon: 'Handshake', title: 'Engagement', desc: 'Fidèles à nos promesses, nous nous investissons pleinement pour votre satisfaction.' },
          { icon: 'CheckCircle2', title: 'Qualité', desc: 'Des ouvrages durables et des finitions soignées, conformes aux normes.' },
        ],
      })
    }::jsonb)`;

    await sql`INSERT INTO page_content (key, value) VALUES ('services', ${
      JSON.stringify({
        methodology: [
          { step: '01', title: 'Consultation', desc: 'Écoute de vos besoins et analyse du site.' },
          { step: '02', title: 'Conception', desc: 'Élaboration des plans et du budget détaillé.' },
          { step: '03', title: 'Exécution', desc: 'Réalisation des travaux selon les normes.' },
          { step: '04', title: 'Livraison', desc: 'Remise des clés et garantie de parfait achèvement.' },
        ],
      })
    }::jsonb)`;

    await sql`INSERT INTO page_content (key, value) VALUES ('contact', ${
      JSON.stringify({
        openingHours: [
          { label: 'Lundi - Vendredi', hours: '08h00 - 17h00' },
          { label: 'Samedi', hours: '08h00 - 13h00' },
        ],
      })
    }::jsonb)`;

    await sql`INSERT INTO page_content (key, value) VALUES ('cta', ${
      JSON.stringify({
        title: "Prêt à démarrer votre projet ?",
        description: "Contactez notre équipe d'experts dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé.",
      })
    }::jsonb)`;
    console.log('  ✅ page_content seeded');

    await sql`INSERT INTO site_settings (key, value) VALUES ('contact', ${
      JSON.stringify({
        phone1: '+236 72 32 06 39',
        phone2: '+236 75 72 62 44',
        email: 'contact@ctba.cf',
        address: 'Bangui, République Centrafricaine',
      })
    }::jsonb)`;
    console.log('  ✅ site_settings seeded');

    console.log('\n🎉 Migration terminée avec succès !');
  } else {
    console.log('⏭️  Les données existent déjà, seed ignoré.');
  }

  process.exit(0);
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
