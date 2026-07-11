import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { fetchAllData, createEntity, updateEntity, deleteEntity, updatePageContent as apiUpdatePageContent, updateSettings as apiUpdateSettings } from '../lib/api-client';
export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  images?: string[];
  inStock: boolean;
  description: string;
  featured?: boolean;
};
export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  date: string;
  serviceId?: string;
};
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
};
export type Service = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
};
export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
};

export type PageContent = {
  home: {
    about: { title: string; subtitle: string; paragraphs: string[]; image?: string };
    stats: { value: string; label: string }[];
    reasons: { icon: string; title: string; desc: string }[];
    values: { icon: string; title: string; desc: string }[];
  };
  services: {
    methodology: { step: string; title: string; desc: string }[];
  };
  contact: {
    openingHours: { label: string; hours: string }[];
  };
  cta: {
    title: string;
    description: string;
  };
};
export type SiteSettings = {
  contact: {
    phone1: string;
    phone2: string;
    email: string;
    address: string;
  };
  heroSlides: {
    home: Slide[];
    services: Slide[];
    shop: Slide[];
    contact: Slide[];
    realisations: Slide[];
  };
};
type SiteContextType = {
  products: Product[];
  projects: Project[];
  testimonials: Testimonial[];
  services: Service[];
  settings: SiteSettings;
  pageContent: PageContent;
  updatePageContent: (content: Partial<PageContent>) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (orderedIds: string[]) => void;
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (orderedIds: string[]) => void;
  addTestimonial: (testimonial: Testimonial) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
};
const defaultProducts: Product[] = [
{
  id: '1',
  name: 'Ciment Portland CEM I 42.5R',
  category: 'Matériaux de base',
  price: '13 500 FCFA',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
  ],
  inStock: true,
  description:
  'Ciment de haute résistance certifié, idéal pour les ouvrages en béton armé et les infrastructures exigeantes.',
  featured: true
},
{
  id: '2',
  name: 'Fer à béton HA 14mm',
  category: 'Armatures',
  price: '5 200 FCFA / barre',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/fer-a-beton',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-acier',
  ],
  inStock: true,
  description:
  'Barres d\'armature à haute adhérence conformes aux normes pour le renforcement de vos structures en béton.',
  featured: true
},
{
  id: '3',
  name: 'Briques creuses 20x20x40',
  category: 'Maçonnerie',
  price: '500 FCFA / unité',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne',
  ],
  inStock: true,
  description:
  'Briques creuses légères et résistantes pour une construction rapide et économique.',
  featured: true
},
{
  id: '4',
  name: 'Sable fin lavé',
  category: 'Agrégats',
  price: '16 000 FCFA / m³',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/mur-brique',
  ],
  inStock: true,
  description:
  'Sable fin de qualité pour enduits, crépis et mortiers de finition.',
  featured: false
},
{
  id: '5',
  name: 'Gravier concassé 15/25',
  category: 'Agrégats',
  price: '27 000 FCFA / m³',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
  ],
  inStock: true,
  description:
  'Gravier concassé propre pour la fabrication de béton de structure.',
  featured: false
},
{
  id: '6',
  name: 'Tôles bac acier 0.5mm',
  category: 'Couverture',
  price: '7 200 FCFA / ml',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/toiture',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/toiture',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
  ],
  inStock: true,
  description:
  'Tôles de couverture en acier galvanisé, durables et résistantes aux intempéries.',
  featured: false
},
{
  id: '7',
  name: 'Pompe à motricité humaine (PMH)',
  category: 'Hydraulique',
  price: 'Sur devis',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/reservoir-eau',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route',
  ],
  inStock: true,
  description:
  'Pompe manuelle robuste pour forages, idéale pour l\'approvisionnement en eau potable des communautés sans accès à l\'électricité.',
  featured: false
},
{
  id: '8',
  name: 'Château d\'eau polyéthylène 5000L',
  category: 'Hydraulique',
  price: 'Sur devis',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/reservoir-eau',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/reservoir-eau',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
  ],
  inStock: true,
  description:
  'Réservoir de stockage d\'eau en polyéthylène haute densité, résistant aux UV, pour systèmes d\'adduction d\'eau.',
  featured: false
}];

const defaultProjects: Project[] = [
{
  id: '1',
  title: 'Construction Complexe Commercial R+5',
  category: 'Bâtiment',
  description:
  'Réalisation complète d\'un complexe commercial moderne au centre-ville de Bangui, avec bureaux et espaces de vente.',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne',
  ],
  date: '2024',
  serviceId: 'construction-btp'
},
{
  id: '2',
  title: 'Rénovation Siège Administratif',
  category: 'Rénovation',
  description:
  'Rénovation complète et modernisation d\'un bâtiment administratif avec mise aux normes et extension.',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero',
  ],
  date: '2024',
  serviceId: 'construction-btp'
},
{
  id: '3',
  title: 'Aménagement Rue Principale',
  category: 'Travaux Publics',
  description:
  'Aménagement et bitumage de la voirie urbaine avec système de drainage et trottoirs.',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-moderne',
  ],
  date: '2023',
  serviceId: 'construction-btp'
},
{
  id: '4',
  title: 'Forage et Adduction d\'Eau Potable',
  category: 'Hydraulique',
  description:
  'Étude hydrogéologique, forage et installation d\'une pompe solaire avec château d\'eau pour desservir une communauté rurale.',
  image:
  'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau',
  images: [
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/reservoir-eau',
    'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route',
  ],
  date: '2024',
  serviceId: 'forages-hydraulique'
}];

const defaultTestimonials: Testimonial[] = [
{
  id: '1',
  name: 'Paul Mboko',
  role: 'Promoteur immobilier',
  content:
  'CTBA a réalisé nos fondations avec un professionnalisme remarquable. L\'équipe est compétente et les délais ont été tenus.',
  rating: 5
},
{
  id: '2',
  name: 'Sylvie N.',
  role: 'Directrice des Projets',
  content:
  'Nous collaborons avec CTBA sur plusieurs chantiers. Leur rigueur et leur savoir-faire en génie civil sont exemplaires.',
  rating: 5
},
{
  id: '3',
  name: 'Thierry K.',
  role: 'Ingénieur en chef',
  content:
  'Une entreprise centrafricaine de confiance qui maîtrise parfaitement les normes de construction modernes.',
  rating: 4
},
{
  id: '4',
  name: 'Odette G.',
  role: 'Responsable ONG, accès à l\'eau',
  content:
  'CTBA a réalisé plusieurs forages pour nos communautés. Un travail sérieux, des points d\'eau fiables et une équipe très à l\'écoute.',
  rating: 5
}];

const defaultServices: Service[] = [
{
  id: 'forages-hydraulique',
  iconName: 'Droplets',
  title: 'Forages et Hydraulique',
  description:
  'Nous facilitons l\'accès à l\'eau potable partout en République Centrafricaine : études, forage, équipement et maintenance, pour des points d\'eau fiables et durables.',
  features: [
  'Réalisation de forages d\'eau potable',
  'Études hydrogéologiques',
  'Installation de pompes manuelles et solaires',
  'Construction de châteaux d\'eau',
  'Systèmes d\'adduction d\'eau potable',
  'Réhabilitation et maintenance des forages']
},
{
  id: 'construction-btp',
  iconName: 'HardHat',
  title: 'Construction et BTP',
  description:
  'Du bâtiment administratif au chantier résidentiel, nous menons vos travaux de construction et de génie civil avec rigueur, du gros œuvre aux finitions.',
  features: [
  'Bâtiments administratifs et résidentiels',
  'Travaux de génie civil',
  'Réhabilitation et rénovation',
  'Maçonnerie, plomberie, électricité',
  'Aménagements et infrastructures diverses']
},
{
  id: 'commerce-general',
  iconName: 'Package',
  title: 'Commerce Général',
  description:
  'Nous importons et distribuons les matériaux et équipements dont vos chantiers et vos activités ont besoin, avec fiabilité et des délais maîtrisés.',
  features: [
  'Import-export de marchandises diverses',
  'Fourniture de matériels de construction',
  'Fourniture d\'équipements techniques et industriels',
  'Distribution de produits divers']
}];

const defaultPageContent: PageContent = {
  home: {
    about: {
      title: 'Qui sommes-nous ?',
      subtitle: 'À propos',
      paragraphs: [
        'COMPTOIR TI BE AFRICA (CTBA) est une entreprise centrafricaine spécialisée dans les travaux de forage hydraulique, la construction de bâtiments et travaux publics (BTP), ainsi que le commerce général.',
        "Créée pour répondre aux besoins croissants en infrastructures et en accès à l'eau potable en République Centrafricaine, nous mettons notre expertise technique au service des institutions publiques, ONG, organisations internationales, entreprises privées et particuliers.",
        'Que vous soyez un particulier, une entreprise ou une institution, nous vous accompagnons avec professionnalisme, transparence et rigueur, du premier échange à la livraison de votre projet.',
      ],
    },
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
  },
  services: {
    methodology: [
      { step: '01', title: 'Consultation', desc: 'Écoute de vos besoins et analyse du site.' },
      { step: '02', title: 'Conception', desc: 'Élaboration des plans et du budget détaillé.' },
      { step: '03', title: 'Exécution', desc: 'Réalisation des travaux selon les normes.' },
      { step: '04', title: 'Livraison', desc: 'Remise des clés et garantie de parfait achèvement.' },
    ],
  },
  contact: {
    openingHours: [
      { label: 'Lundi - Vendredi', hours: '08h00 - 17h00' },
      { label: 'Samedi', hours: '08h00 - 13h00' },
    ],
  },
  cta: {
    title: "Prêt à démarrer votre projet ?",
    description: "Contactez notre équipe d'experts dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé.",
  },
};

const defaultSettings: SiteSettings = {
  contact: {
    phone1: '+236 72 32 06 39',
    phone2: '+236 75 72 62 44',
    email: 'contact@ctba.cf',
    address: 'Bangui, République Centrafricaine'
  },
  heroSlides: {
    home: [
    {
      id: 'h1',
      title: "Bâtissons l'avenir de la Centrafrique",
      subtitle:
      "COMPTOIR TI BE AFRICA (CTBA) : forage hydraulique, construction, BTP et commerce général, au service de la RCA.",
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne'
    },
    {
      id: 'h2',
      title: "Faciliter l'accès à l'eau potable",
      subtitle:
      'Études hydrogéologiques, forages, pompes et châteaux d\'eau : des solutions durables pour vos communautés.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/pompe-eau'
    },
    {
      id: 'h3',
      title: 'De la Conception à la Réalisation',
      subtitle:
      'Nous vous accompagnons à chaque étape avec professionnalisme et rigueur.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/immeuble-moderne'
    }],

    services: [
    {
      id: 's1',
      title: 'Nos Services',
      subtitle:
      'Forage et hydraulique, construction et BTP, commerce général : une expertise complète adaptée à vos besoins.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal'
    },
    {
      id: 's2',
      title: 'Savoir-faire centrafricain',
      subtitle: 'Des ingénieurs et techniciens qualifiés pour vos projets.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/travaux-route'}
    ],

    shop: [
    {
      id: 'sh1',
      title: 'Boutique de Matériaux',
      subtitle:
      'Matériaux de construction de qualité professionnelle pour tous vos chantiers.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement'
    },
    {
      id: 'sh2',
      title: 'Fourniture fiable',
      subtitle:
      'Des produits certifiés livrés directement sur votre chantier.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/chantier-terrassement'}
    ],

    contact: [
    {
      id: 'c1',
      title: 'Contactez CTBA',
      subtitle:
      'Notre équipe est à votre disposition pour étudier votre projet et vous établir un devis personnalisé.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero'
    }],

    realisations: [
    {
      id: 'r1',
      title: 'Nos Réalisations',
      subtitle:
      'Découvrez nos projets récents et notre expertise en action.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero'
    },
    {
      id: 'r2',
      title: 'La qualité comme signature',
      subtitle:
        'Chaque ouvrage reflète notre engagement pour l\'excellence.',
      image:
      'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/construction-metal'}
    ],
  }
};
const SiteContext = createContext<SiteContextType | undefined>(undefined);

const SITE_STORAGE_KEYS = [
  'ctba_products',
  'ctba_projects',
  'ctba_testimonials',
  'ctba_services',
  'ctba_settings',
  'ctba_page_content',
] as const;
const SITE_STORAGE_KEY_SET = new Set<string>(SITE_STORAGE_KEYS);

type SiteSnapshot = {
  products: Product[];
  projects: Project[];
  testimonials: Testimonial[];
  services: Service[];
  settings: SiteSettings;
  pageContent: PageContent;
};

/** Merge fetched settings with defaults (in case some keys aren't in Neon yet) */
function mergeSettings(fetched: Partial<SiteSettings>): SiteSettings {
  return {
    contact: { ...defaultSettings.contact, ...(fetched.contact || {}) },
    heroSlides: { ...defaultSettings.heroSlides, ...(fetched.heroSlides || {}) },
  };
}

function mergePageContent(fetched: Partial<PageContent>): PageContent {
  return {
    home: { ...defaultPageContent.home, ...(fetched.home || {}) },
    services: { ...defaultPageContent.services, ...(fetched.services || {}) },
    contact: { ...defaultPageContent.contact, ...(fetched.contact || {}) },
    cta: { ...defaultPageContent.cta, ...(fetched.cta || {}) },
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Erreur inconnue';
}

function mergeCollections<T extends { id: string }>(remote: T[], local: T[]) {
  const remoteIds = new Set(remote.map((item) => item.id));
  const hasLocalOnlyItems = local.some((item) => !remoteIds.has(item.id));

  if (!hasLocalOnlyItems) {
    return remote;
  }

  const merged = new Map<string, T>();
  for (const item of remote) {
    merged.set(item.id, item);
  }
  for (const item of local) {
    merged.set(item.id, item);
  }
  return Array.from(merged.values());
}

function readLocalStorageSnapshot(): SiteSnapshot {
  const stored = <T,>(key: string, fallback: T): T => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) as T : fallback;
    } catch {
      return fallback;
    }
  };
  return {
    products: stored('ctba_products', defaultProducts) as Product[],
    projects: stored('ctba_projects', defaultProjects) as Project[],
    testimonials: stored('ctba_testimonials', defaultTestimonials) as Testimonial[],
    services: stored('ctba_services', defaultServices) as Service[],
    settings: mergeSettings(stored('ctba_settings', {})),
    pageContent: mergePageContent(stored('ctba_page_content', {})),
  };
}

function saveToLocalStorage(data: Partial<SiteSnapshot>) {
  if (data.products) localStorage.setItem('ctba_products', JSON.stringify(data.products));
  if (data.projects) localStorage.setItem('ctba_projects', JSON.stringify(data.projects));
  if (data.testimonials) localStorage.setItem('ctba_testimonials', JSON.stringify(data.testimonials));
  if (data.services) localStorage.setItem('ctba_services', JSON.stringify(data.services));
  if (data.settings) localStorage.setItem('ctba_settings', JSON.stringify(data.settings));
  if (data.pageContent) localStorage.setItem('ctba_page_content', JSON.stringify(data.pageContent));
}

/** Generic update helper: update local state + cache, then try Neon */
function localThenNeon<T>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  updater: (prev: T[]) => T[],
  cacheKey: string,
  neonCall: () => Promise<unknown>,
) {
  setter((prev) => {
    const next = updater(prev);
    localStorage.setItem(cacheKey, JSON.stringify(next));
    return next;
  });
  return neonCall().catch((err: unknown) => {
    console.warn('Neon sync failed:', getErrorMessage(err));
    throw err;
  });
}

/** Generic delete helper */
function localDeleteThenNeon<T>(
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  id: string,
  cacheKey: string,
  neonCall: () => Promise<unknown>,
) {
  setter((prev) => {
    const next = prev.filter((item) => item.id !== id);
    localStorage.setItem(cacheKey, JSON.stringify(next));
    return next;
  });
  return neonCall().catch((err: unknown) => {
    console.warn('Neon sync failed:', getErrorMessage(err));
    throw err;
  });
}

export function SiteProvider({ children }: {children: ReactNode;}) {
  const cached = readLocalStorageSnapshot();
  const [products, setProducts] = useState<Product[]>(cached.products);
  const [projects, setProjects] = useState<Project[]>(cached.projects);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(cached.testimonials);
  const [services, setServices] = useState<Service[]>(cached.services);
  const [settings, setSettings] = useState<SiteSettings>(cached.settings);
  const [pageContent, setPageContent] = useState<PageContent>(cached.pageContent);

  const syncFromLocalStorage = useCallback(() => {
    const snapshot = readLocalStorageSnapshot();
    setProducts(snapshot.products);
    setProjects(snapshot.projects);
    setTestimonials(snapshot.testimonials);
    setServices(snapshot.services);
    setSettings(snapshot.settings);
    setPageContent(snapshot.pageContent);
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (event.key !== null && !SITE_STORAGE_KEY_SET.has(event.key)) {
        return;
      }
      syncFromLocalStorage();
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncFromLocalStorage]);

  // On mount: try Neon API, then fall back to localStorage (already loaded)
  useEffect(() => {
    fetchAllData()
      .then((data) => {
        const localSnapshot = readLocalStorageSnapshot();
        const mergedProducts = mergeCollections(data.products || [], localSnapshot.products);
        const mergedProjects = mergeCollections(data.projects || [], localSnapshot.projects);
        const mergedTestimonials = mergeCollections(data.testimonials || [], localSnapshot.testimonials);
        const mergedServices = mergeCollections(data.services || [], localSnapshot.services);
        const mergedSettings = mergeSettings(data.settings || {});
        const mergedPC = mergePageContent(data.pageContent || {});

        setProducts(mergedProducts);
        setProjects(mergedProjects);
        setTestimonials(mergedTestimonials);
        setServices(mergedServices);
        setSettings(mergedSettings);
        setPageContent(mergedPC);
        saveToLocalStorage({
          products: mergedProducts,
          projects: mergedProjects,
          testimonials: mergedTestimonials,
          services: mergedServices,
          settings: mergedSettings,
          pageContent: mergedPC,
        });
      })
      .catch((err) => {
        console.warn('Neon unavailable, using localStorage fallback:', getErrorMessage(err));
      });
  }, []);

  // ── CRUD operations (simplified: local first, then Neon) ──

  const addProduct = (product: Product) => {
    return localThenNeon(setProducts, (prev) => [...prev, product], 'ctba_products',
      () => createEntity('products', product));
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    return localThenNeon(setProducts, (prev) => prev.map((p) => p.id === id ? { ...p, ...updated } : p), 'ctba_products',
      () => updateEntity('products', id, { ...updated, id }));
  };

  const deleteProduct = (id: string) => {
    return localDeleteThenNeon(setProducts, id, 'ctba_products',
      () => deleteEntity('products', id));
  };

  const reorderProducts = (orderedIds: string[]) => {
    localThenNeon(setProducts, (prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return orderedIds.map((id) => map.get(id)).filter(Boolean) as Product[];
    }, 'ctba_products',
      () => Promise.resolve());
  };

  const addProject = (project: Project) => {
    return localThenNeon(setProjects, (prev) => [...prev, project], 'ctba_projects',
      () => createEntity('projects', project));
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    return localThenNeon(setProjects, (prev) => prev.map((p) => p.id === id ? { ...p, ...updated } : p), 'ctba_projects',
      () => updateEntity('projects', id, { ...updated, id }));
  };

  const deleteProject = (id: string) => {
    return localDeleteThenNeon(setProjects, id, 'ctba_projects',
      () => deleteEntity('projects', id));
  };

  const reorderProjects = (orderedIds: string[]) => {
    localThenNeon(setProjects, (prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return orderedIds.map((id) => map.get(id)).filter(Boolean) as Project[];
    }, 'ctba_projects',
      () => Promise.resolve());
  };

  const addTestimonial = (testimonial: Testimonial) => {
    return localThenNeon(setTestimonials, (prev) => [...prev, testimonial], 'ctba_testimonials',
      () => createEntity('testimonials', testimonial));
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    return localThenNeon(setTestimonials, (prev) => prev.map((t) => t.id === id ? { ...t, ...updated } : t), 'ctba_testimonials',
      () => updateEntity('testimonials', id, { ...updated, id }));
  };

  const deleteTestimonial = (id: string) => {
    return localDeleteThenNeon(setTestimonials, id, 'ctba_testimonials',
      () => deleteEntity('testimonials', id));
  };

  const updateSettings = (updated: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('ctba_settings', JSON.stringify(next));
      return next;
    });
    return apiUpdateSettings(updated).catch((err) => {
      console.warn('Neon sync failed:', err.message);
      throw err;
    });
  };

  const updatePageContent = (updated: Partial<PageContent>) => {
    setPageContent((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('ctba_page_content', JSON.stringify(next));
      return next;
    });
    return apiUpdatePageContent(updated).catch((err) => {
      console.warn('Neon sync failed:', err.message);
      throw err;
    });
  };

  return (
    <SiteContext.Provider
      value={{
        products,
        projects,
        testimonials,
        services,
        settings,
        pageContent,
        updatePageContent,
        addProduct,
        updateProduct,
        deleteProduct,
        reorderProducts,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        updateSettings
      }}>
      {children}
    </SiteContext.Provider>);
}
// eslint-disable-next-line react-refresh/only-export-components
export function useSiteData() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
}
