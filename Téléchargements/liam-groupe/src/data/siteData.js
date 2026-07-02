// Données centrales du site LIAM Groupe
// Images hébergées sur Cloudinary — optimisées avec f_auto,q_auto

const CLOUD_NAME = 'dwmrzp61c'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

/**
 * Génère une URL Cloudinary optimisée pour une image.
 * Utilise f_auto (meilleur format), q_auto (qualité optimale)
 * et dpr_auto (adaptation aux écrans retina).
 * @param {string} seed  Identifiant unique de l'image (ex: "home-hero")
 * @param {number} w     Largeur souhaitée
 * @param {number} h     Hauteur souhaitée
 * @param {string} fit   Mode de redimensionnement (fill, scale, etc.)
 * @param {string} quality Qualité Cloudinary (auto, eco, best, good, low)
 */
export const img = (seed, w = 800, h = 600, fit = 'fill', quality = 'auto') =>
  `${BASE_URL}/f_auto,q_${quality},w_${w},h_${h},c_${fit},dpr_auto/v1/liam-groupe/${seed}`

/**
 * Génère une URL de blur placeholder Cloudinary (très petite, qualité basse)
 * pour l'effet de chargement progressif (LQIP).
 */
export const imgBlur = (seed) =>
  `${BASE_URL}/f_auto,q_10,w_200,h_112,c_fill,e_blur:500,dpr_auto/v1/liam-groupe/${seed}`

/**
 * Version optimisée pour les images hero — plus légère et éco.
 */
export const imgHero = (seed) => img(seed, 1600, 900, 'fill', 'eco')

/**
 * Génère les URLs srcSet pour le chargement responsive d'images.
 * Produit des URLs à différentes largeurs pour que le navigateur
 * choisisse la meilleure taille selon l'écran.
 * @param {string} seed  Identifiant unique de l'image
 * @param {number[]} widths  Largeurs à générer (par défaut: 480, 768, 1024, 1280, 1600)
 * @param {number} h    Hauteur
 * @param {string} fit  Mode de redimensionnement
 */
export const imgSrcSet = (seed, widths = [480, 768, 1024, 1280, 1600], h = 600, fit = 'fill') =>
  widths
    .map(w => `${BASE_URL}/f_auto,q_auto,w_${w},h_${h},c_${fit},dpr_auto/v1/liam-groupe/${seed} ${w}w`)
    .join(', ')

/**
 * Attribut sizes pour accompagner srcSet, indiquant la largeur
de rendu de l'image selon la largeur de la fenêtre.
 * @param {string} type  'full' (100vw) | 'half' (50vw) | 'third' (33vw)
 */
export const imgSizes = (type = 'full') => {
  const sizes = {
    full: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw',
    half: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw',
    third: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  }
  return sizes[type] || sizes.full
}

export const siteInfo = {
  name: "LIAM",
  fullName: "LIAM Groupe",
  tagline: "Construisons ensemble la Centrafrique de demain",
  description:
    "Organisation centrafricaine à but non lucratif active dans l'événementiel, l'entrepreneuriat féminin, le sport, la gastronomie solidaire et la formation des jeunes à Bangui.",
  address: ["Avenue des Martyrs, Immeuble Salle King", "Bangui, République Centrafricaine"],
  phones: ["+236 72 00 00 00", "+236 75 00 00 00"],
  emails: ["contact@liamgroupe.org", "partenariat@liamgroupe.org"],
  hours: ["Lundi — Vendredi : 8h00 — 17h00", "Samedi : 9h00 — 13h00"],
  contactPage: {
    address: ["Secteur 3, Rue des Martyrs", "Bangui, République Centrafricaine"],
    phones: ["+236 72 34 56 78", "+236 75 12 34 56"],
    emails: ["contact@liamgroupe.cf", "partenariats@liamgroupe.cf"],
    hours: ["Lundi — Vendredi : 8h00 — 17h00", "Samedi : 9h00 — 12h00"],
  },
};

export const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/a-propos" },
  { label: "Domaines", to: "/domaines", dropdown: true },
  { label: "Événements", to: "/evenements" },
  { label: "Actualités", to: "/actualites" },
  { label: "Partenaires", to: "/partenaires" },
  { label: "Contact", to: "/contact" },
];

export const domains = [
  {
    slug: "g-fitness",
    name: "G-Fitness",
    category: "SPORT & BIEN-ÊTRE",
    icon: "heart",
    shortDescription:
      "Promouvoir la santé et le bien-être par le sport, avec des programmes adaptés aux femmes et aux jeunes de Bangui. Tournois de basketball…",
    heroImage: img("gfitness-hero", 1920, 700),
    cardImage: img("gfitness-hero", 800, 500),
    objectives: [
      "Promouvoir la pratique sportive chez les femmes et les jeunes filles en Centrafrique",
      "Lutter contre les stéréotypes de genre dans le sport",
      "Améliorer la santé physique et mentale des communautés",
      "Détecter et accompagner les talents sportifs",
    ],
    programs: [
      {
        title: "Tournoi Féminin de Basketball",
        description:
          "Compétition inter-quartiers rassemblant 16 équipes féminines à Bangui.",
      },
      {
        title: "G-Fitness Junior",
        description:
          "Programme d'initiation sportive pour les enfants et adolescents des quartiers défavorisés.",
      },
      {
        title: "Santé par le sport",
        description:
          "Ateliers de sensibilisation à l'hygiène de vie et à la nutrition équilibrée.",
      },
    ],
    stats: [
      { value: "1200+", label: "Femmes sportives accompagnées" },
      { value: "45", label: "Tournois organisés" },
      { value: "8", label: "Quartiers couverts" },
    ],
    gallery: [img("gfitness-gallery-1", 700, 500), img("gfitness-gallery-2", 700, 500)],
  },
  {
    slug: "ogab",
    name: "O'GAB",
    category: "GASTRONOMIE SOLIDAIRE",
    icon: "utensils",
    shortDescription:
      "Valoriser la richesse culinaire centrafricaine tout en créant des opportunités économiques pour les femmes. Restauration événementielle, atelie…",
    heroImage: img("ogab-hero", 1920, 700),
    cardImage: img("ogab-hero", 800, 500),
    objectives: [
      "Valoriser les produits locaux et le savoir-faire culinaire centrafricain",
      "Créer des emplois décents pour les femmes dans la restauration",
      "Assurer la sécurité alimentaire des communautés vulnérables",
      "Promouvoir la gastronomie centrafricaine à l'international",
    ],
    programs: [
      {
        title: "Ateliers culinaires",
        description:
          "Formation en cuisine traditionnelle et moderne pour les femmes entrepreneures.",
      },
      {
        title: "Restauration événementielle",
        description:
          "Service de traiteur pour les événements, valorisant les produits locaux.",
      },
      {
        title: "Restaurant solidaire",
        description:
          "Établissement proposant une cuisine accessible tout en employant des femmes formées.",
      },
    ],
    stats: [
      { value: "180", label: "Femmes formées" },
      { value: "35", label: "Ateliers réalisés" },
      { value: "12", label: "Produits locaux valorisés" },
    ],
    gallery: [img("ogab-gallery-1", 700, 500), img("ogab-gallery-2", 700, 500)],
  },
  {
    slug: "entrepreneuriat",
    name: "Entrepreneuriat & Leadership",
    category: "LEADERSHIP FÉMININ",
    icon: "briefcase",
    shortDescription:
      "Autonomiser les femmes centrafricaines par la formation au leadership, l'accompagnement entrepreneurial et la mise en réseau…",
    heroImage: img("entreprenariat-hero", 1920, 700),
    cardImage: img("entreprenariat-hero", 800, 500),
    objectives: [
      "Former les femmes aux techniques de gestion et d'entrepreneuriat",
      "Créer un réseau de femmes leaders et mentors",
      "Faciliter l'accès au financement pour les projets féminins",
      "Promouvoir l'égalité des genres dans le monde des affaires",
    ],
    programs: [
      {
        title: "Conférences « Oser Entreprendre »",
        description:
          "Événements inspirants avec des femmes leaders du secteur privé et public.",
      },
      {
        title: "Programme d'incubation",
        description:
          "Accompagnement de 6 mois pour les projets entrepreneuriaux féminins.",
      },
      {
        title: "Mentorat",
        description:
          "Mise en relation entre entrepreneures débutantes et mentors expérimentés.",
      },
    ],
    stats: [
      { value: "300+", label: "Femmes formées" },
      { value: "45", label: "Startups accompagnées" },
      { value: "28", label: "Mentors actifs" },
    ],
    gallery: [img("entreprenariat-gallery-1", 700, 500), img("entreprenariat-gallery-2", 700, 500)],
  },
  {
    slug: "formation",
    name: "Formation des Jeunes",
    category: "ÉDUCATION & INSERTION",
    icon: "graduation",
    shortDescription:
      "Offrir aux jeunes centrafricains des formations pratiques et professionnalisantes pour favoriser leur insertion sur le marché du travail. Ateliers,…",
    heroImage: img("formation-hero", 1920, 700),
    cardImage: img("formation-hero", 800, 500),
    objectives: [
      "Réduire le chômage des jeunes par la formation professionnelle",
      "Développer les compétences numériques et techniques",
      "Faciliter l'insertion professionnelle et l'entrepreneuriat",
      "Créer un vivier de talents pour les entreprises locales",
    ],
    programs: [
      {
        title: "Formation professionnelle",
        description:
          "Ateliers pratiques dans les métiers du numérique, de la cuisine, de la communication.",
      },
      {
        title: "Stages en entreprise",
        description:
          "Mise en relation avec des partenaires employeurs pour des stages rémunérés.",
      },
      {
        title: "Programme de mentorat",
        description:
          "Accompagnement individuel des jeunes par des professionnels expérimentés.",
      },
    ],
    stats: [
      { value: "500+", label: "Jeunes formés" },
      { value: "120", label: "Emplois créés" },
      { value: "30", label: "Startups lancées" },
    ],
    gallery: [img("formation-gallery-1", 700, 500), img("formation-gallery-2", 700, 500)],
  },
  {
    slug: "communication",
    name: "Communication",
    category: "VISIBILITÉ & MÉDIAS",
    icon: "megaphone",
    shortDescription:
      "Assurer la visibilité des actions de LIAM Groupe et de ses partenaires à travers une stratégie de communication moderne : relations presse,…",
    heroImage: img("communication-hero", 1920, 700),
    cardImage: img("communication-hero", 800, 500),
    objectives: [
      "Assurer la visibilité des actions de LIAM Groupe et de ses partenaires",
      "Promouvoir une image positive de la Centrafrique",
      "Former les jeunes aux métiers des médias et de la communication",
      "Développer une communauté engagée autour de nos causes",
    ],
    programs: [
      {
        title: "Relations presse",
        description:
          "Couverture médiatique des événements et diffusion des communiqués aux médias locaux et internationaux.",
      },
      {
        title: "Production audiovisuelle",
        description:
          "Création de documentaires, reportages et contenus digitaux mettant en valeur nos actions.",
      },
      {
        title: "Community management",
        description:
          "Gestion des réseaux sociaux et engagement de la communauté en ligne.",
      },
    ],
    stats: [
      { value: "50+", label: "Reportages produits" },
      { value: "25K", label: "Abonnés réseaux sociaux" },
      { value: "15", label: "Partenaires médias" },
    ],
    gallery: [img("communication-gallery-1", 700, 500), img("communication-gallery-2", 700, 500)],
  },
  {
    slug: "evenementiel",
    name: "Événementiel",
    category: "CULTURE & GALAS",
    icon: "calendar",
    shortDescription:
      "Organiser des événements d'envergure qui rassemblent, inspirent et célèbrent la culture centrafricaine. Miss Centrafrique, galas de…",
    heroImage: img("evenementiel-hero", 1920, 700),
    cardImage: img("evenementiel-hero", 800, 500),
    objectives: [
      "Organiser des événements qui rassemblent et inspirent les communautés",
      "Promouvoir la culture et la créativité centrafricaine",
      "Créer des opportunités de networking et de business",
      "Générer des ressources pour financer nos programmes sociaux",
    ],
    programs: [
      {
        title: "Miss Centrafrique",
        description: "Concours national de beauté et de culture célébrant la diversité de la RCA.",
      },
      {
        title: "Gala de charité",
        description:
          "Soirée prestigieuse réunissant partenaires et donateurs pour le financement des programmes.",
      },
      {
        title: "Festivals culturels",
        description:
          "Manifestations artistiques mettant en valeur la musique, la danse et les arts locaux.",
      },
    ],
    stats: [
      { value: "45", label: "Événements organisés" },
      { value: "80K", label: "Spectateurs cumulés" },
      { value: "12", label: "Artistes accompagnés" },
    ],
    gallery: [img("evenementiel-gallery-1", 700, 500), img("evenementiel-gallery-2", 700, 500)],
  },
];

// Images du carousel hero de l'accueil
// Utilise les héros des autres pages pour créer une rotation variée
export const homeHeroImages = [
  img('home-hero', 1920, 1080),
  img('apropos-hero', 1920, 1080),
  img('evenements-hero', 1920, 1080),
  img('actualites-hero', 1920, 1080),
  img('partenaires-hero', 1920, 1080),
];

export const homeStats = [
  { value: "5000+", label: "Bénéficiaires directs" },
  { value: "45", label: "Événements organisés" },
  { value: "300+", label: "Femmes formées" },
  { value: "12", label: "Partenaires actifs" },
];

export const aboutStats = [
  { value: "9", label: "Années d'existence" },
  { value: "50+", label: "Membres actifs" },
  { value: "6", label: "Domaines d'intervention" },
  { value: "5", label: "Préfectures couvertes" },
];

export const events = [
  {
    slug: "tournoi-feminin-basketball-2026",
    title: "Tournoi Féminin de Basketball — Édition 2026",
    date: "15 Août 2026",
    location: "Gymnase Omnisports de Bangui",
    category: "G-Fitness",
    status: "a_venir",
    image: img("event-basketball", 800, 600),
    description:
      "La 3ème édition du tournoi inter-quartiers de basketball féminin rassemble 16 équipes pour une compétition de haut niveau….",
  },
  {
    slug: "conference-leadership-feminin",
    title: "Conférence Leadership Féminin — « Oser Entreprendre »",
    date: "28 Juin 2026",
    location: "Salle de Conférence ASK Gras Savoye, Bangui",
    category: "Entrepreneuriat",
    status: "a_venir",
    image: img("event-conference", 800, 600),
    description:
      "Une journée de partage et d'inspiration avec des femmes leaders du secteur privé et public centrafricain. Ateliers pratiques,…",
  },
  {
    slug: "atelier-formation-creation-entreprise",
    title: "Atelier Formation — Création d'Entreprise",
    date: "10 Juillet 2026",
    location: "Siège LIAM Groupe, Bangui",
    category: "Formation",
    status: "a_venir",
    image: img("event-formation", 800, 600),
    description:
      "Formation intensive de 3 jours pour les jeunes entrepreneurs. Business model, financement, marketing digital et gestion…",
  },
  {
    slug: "soiree-gala-liam-2025",
    title: "Soirée de Gala — LIAM Groupe 2025",
    date: "20 Décembre 2025",
    location: "Hôtel Ledger Plaza, Bangui",
    category: "Événementiel",
    status: "passe",
    image: img("event-gala", 800, 600),
    description:
      "Une soirée prestigieuse réunissant partenaires, sponsors et personnalités pour célébrer les réalisations de l'année….",
  },
  {
    slug: "atelier-gastronomie-saveurs-centrafrique",
    title: "Atelier Gastronomie — Saveurs de Centrafrique",
    date: "10 Novembre 2025",
    location: "Espace O'GAB, Bangui",
    category: "O'GAB",
    status: "passe",
    image: img("event-gastronomie", 800, 600),
    description:
      "Atelier culinaire mettant à l'honneur les produits locaux et le savoir-faire des femmes centrafricaines. Dégustation et…",
  },
  {
    slug: "miss-centrafrique-2025",
    title: "Miss Centrafrique 2025",
    date: "15 Octobre 2025",
    location: "Salle King, Bangui",
    category: "Événementiel",
    status: "passe",
    image: img("event-miss", 800, 600),
    description:
      "Concours de beauté et de culture célébrant la diversité et la richesse culturelle de la République Centrafricaine. Plus de 5000…",
  },
];

export const news = [
  {
    slug: "prix-innovation-sociale-2026",
    tag: "ACTUALITÉ",
    date: "12 Juin 2026",
    title: "LIAM Groupe remporte le prix de l'Innovation Sociale 2026",
    excerpt:
      "Reconnue pour son impact sur l'entrepreneuriat féminin en Centrafrique, LIAM Groupe a été récompensée lors du…",
    image: img("news-prix", 800, 600),
  },
  {
    slug: "partenariat-minusca",
    tag: "PARTENARIAT",
    date: "3 Mai 2026",
    title: "Nouveau partenariat avec la MINUSCA pour la paix par le sport",
    excerpt:
      "Un accord de coopération a été signé pour organiser des tournois inter-communautaires dans les préfectures de…",
    image: img("news-minusca", 800, 600),
  },
  {
    slug: "ogab-restaurant-solidaire",
    tag: "O'GAB",
    date: "18 Avril 2026",
    title: "O'GAB ouvre son premier restaurant solidaire à Bangui",
    excerpt:
      "Le restaurant O'GAB emploie 15 femmes formées par LIAM Groupe et propose une cuisine 100% locale à des prix accessibles.",
    image: img("news-ogab", 800, 600),
  },
  {
    slug: "500-jeunes-formes-numerique",
    tag: "FORMATION",
    date: "10 Mars 2026",
    title: "500 jeunes formés aux métiers du numérique en 2025",
    excerpt:
      "Bilan de l'année écoulée pour le programme de formation des jeunes : 500 diplômés, 120 emplois créés et 30 startups…",
    image: img("news-formation", 800, 600),
  },
  {
    slug: "tournoi-basketball-10000-spectateurs",
    tag: "G-FITNESS",
    date: "22 Février 2026",
    title: "Le Tournoi Féminin de Basketball atteint 10 000 spectateurs",
    excerpt:
      "Record d'affluence battu pour la finale du tournoi inter-quartiers. Un événement qui confirme l'engouement croissant pour le…",
    image: img("news-basketball", 800, 600),
  },
  {
    slug: "entretien-marie-claire-ngbokoli",
    tag: "PORTRAIT",
    date: "5 Janvier 2026",
    title: "Entretien avec Marie-Claire Ngbokoli : « L'avenir passe par la jeunesse »",
    excerpt:
      "La fondatrice de LIAM Groupe se confie sur les défis de l'ONG, ses réussites et ses projets pour les années à venir.",
    image: img("news-portrait", 800, 600),
  },
];

export const team = [
  {
    name: "Marie-Claire Ngbokoli",
    role: "Fondatrice & Présidente",
    image: img("team-marie-claire", 600, 700),
    description:
      "Visionnaire et engagée, elle a fondé LIAM Groupe en 2015 pour offrir aux femmes et aux jeunes centrafricains les outils de leur propre développement.",
  },
  {
    name: "Jean-Pierre Mbaïkoua",
    role: "Directeur Exécutif",
    image: img("team-jean-pierre", 600, 700),
    description:
      "Pilote la stratégie globale de l'organisation et la coordination des six domaines d'intervention de LIAM Groupe.",
  },
  {
    name: "Aminata Koyambou",
    role: "Responsable G-Fitness",
    image: img("team-aminata", 600, 700),
    description:
      "Ancienne athlète, elle anime les programmes sportifs de LIAM Groupe destinés aux femmes et aux jeunes filles de Bangui.",
  },
  {
    name: "Florence Dacko-Posso",
    role: "Responsable O'GAB",
    image: img("team-florence", 600, 700),
    description:
      "Chef cuisinière et entrepreneure. Elle développe les programmes de gastronomie solidaire et valorise les produits locaux centrafricains à travers des ateliers et événements culinaires.",
  },
  {
    name: "Romain Dologuélé",
    role: "Responsable Événementiel",
    image: img("team-romain", 600, 700),
    description:
      "Organisateur d'événements avec plus de 10 ans d'expérience. Il coordonne les galas, tournois sportifs et manifestations culturelles de LIAM Groupe à travers le pays.",
  },
  {
    name: "Esther Gbezera",
    role: "Responsable Communication",
    image: img("team-esther", 600, 700),
    description:
      "Journaliste et communicatrice. Elle assure la visibilité des actions de l'ONG et développe les partenariats médias pour amplifier l'impact de nos programmes.",
  },
];

export const partners = [
  {
    name: "FAFECA",
    initial: "F",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/fafeca.png",
    color: "#8A0015",
    category: "PARTENAIRE INSTITUTIONNEL",
    subtitle: "Fédération des Associations Féminines de Centrafrique",
    description:
      "FAFECA représente plus de 120 associations féminines à travers la République Centrafricaine. Partenaire historique de LIAM Groupe depuis 2018, elle nous accompagne dans le déploiement de nos programmes de leadership féminin et de formation des jeunes femmes.",
    collaboration: "Programmes conjoints de formation au leadership féminin, mentorat entrepreneurial.",
    website: null,
  },
  {
    name: "ASK Gras Savoye",
    initial: "A",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/ask-gras-savoye.png",
    color: "#16335B",
    category: "PARTENAIRE CORPORATE",
    subtitle: "ASK Gras Savoye - Bangui",
    description:
      "Leader de l'assurance et de la protection sociale en République Centrafricaine. ASK Gras Savoye nous soutient financièrement et met à disposition ses salles de conférence pour nos événements.",
    collaboration: "Soutien financier, mise à disposition d'espaces événementiels, mentorat entrepreneurial.",
    website: null,
  },
  {
    name: "Salle King",
    initial: "S",
    color: "#C99A2E",
    category: "PARTENAIRE ÉVÉNEMENTIEL",
    subtitle: "Salle King - Complexe Événementiel",
    description:
      "Principal complexe événementiel de Bangui. Salle King accueille nos plus grands événements : galas de charité, concours de beauté, tournois sportifs et conférences internationales.",
    collaboration: "Mise à disposition des salles, équipements audiovisuels, logistique événementielle.",
    website: null,
  },
  {
    name: "Diaspora Multimedia",
    initial: "D",
    color: "#1E5631",
    category: "PARTENAIRE MÉDIA",
    subtitle: "Diaspora Multimedia RCA",
    description:
      "Agence de communication et production audiovisuelle spécialisée dans la promotion de la culture centrafricaine. Diaspora Multimedia assure la couverture médiatique de tous nos événements et la production de nos contenus digitaux.",
    collaboration: "Couverture événementielle, production vidéo, community management, relations presse.",
    website: "#",
  },
  {
    name: "MINUSCA",
    initial: "M",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/minusca.png",
    color: "#2255A4",
    category: "PARTENAIRE INTERNATIONAL",
    subtitle: "Mission Multidimensionnelle Intégrée des Nations Unies pour la Stabilisation en Centrafrique",
    description:
      "La MINUSCA soutient nos programmes de consolidation de la paix par le sport et la culture. Grâce à leur appui, nous avons pu organiser des événements inter-communautaires dans plusieurs préfectures de la RCA.",
    collaboration: "Financement de projets, sécurité événementielle, appui logistique sur le terrain.",
    website: "#",
  },
  {
    name: "ONG Espoir",
    initial: "E",
    color: "#C9531E",
    category: "PARTENAIRE ASSOCIATIF",
    subtitle: "ONG Espoir pour la Jeunesse",
    description:
      "Organisation non gouvernementale centrafricaine dédiée à l'éducation et à l'insertion professionnelle des jeunes. Ensemble, nous avons formé plus de 500 jeunes aux métiers de la cuisine, de la communication et du sport.",
    collaboration: "Programmes de formation conjoints, bourses d'études, stages professionnels.",
    website: "#",
  },
];

export const testimonials = [
  {
    quote:
      "La formation en bureautique et communication digitale m'a permis de décrocher un stage dans une entreprise de la place. Aujourd'hui je suis autonome et je peux aider ma famille. Merci LIAM Groupe !",
    name: "Christelle Ngoumbango",
    role: "Bénéficiaire, programme Formation des Jeunes",
    image: img("testimonial-christelle", 100, 100),
  },
  {
    quote:
      "O'GAB met en valeur le patrimoine culinaire centrafricain comme personne d'autre. Les ateliers gastronomiques créent des emplois pour les femmes tout en préservant nos traditions — une initiative remarquable.",
    name: "Michel Béranger",
    role: "Chef cuisinier, partenaire O'GAB",
    image: img("testimonial-michel", 100, 100),
  },
  {
    quote:
      "Notre partenariat avec LIAM Groupe démontre comment la société civile peut être un relais efficace pour les initiatives de paix et de développement. Leur connaissance du terrain est exceptionnelle.",
    name: "Fatimé Hassan",
    role: "Représentante, MINUSCA",
    image: img("testimonial-fatime", 100, 100),
  },
];

export const footerLinks = {
  liamGroupe: [
    { label: "Notre mission", to: "/a-propos" },
    { label: "Notre équipe", to: "/a-propos" },
    { label: "Nos partenaires", to: "/partenaires" },
    { label: "Nous soutenir", to: "/partenaires" },
  ],
  domaines: domains.map((d) => ({ label: d.name, to: `/domaines/${d.slug}` })),
  agir: [
    { label: "Devenir partenaire", to: "/partenaires" },
    { label: "Événements à venir", to: "/evenements" },
    { label: "Actualités", to: "/actualites" },
  ],
};
