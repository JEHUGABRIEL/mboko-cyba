export interface HeroSlide {
  image: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  initials: string;
  rating: number;
}

export interface Partner {
  name: string;
  logo: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  isNew?: boolean;
}

// ===== HERO SLIDES =====
export const heroSlides: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    badge: "DEPUIS 2015",
    title: "L'Expertise NTIC au service de votre",
    highlight: "performance",
    subtitle:
      "Intégrateur de solutions en informatique et télécommunication en République Centrafricaine. Nous accompagnons les entreprises dans leur transformation numérique.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
    badge: "INFRASTRUCTURES RÉSEAU",
    title: "Connectivité haut débit pour",
    highlight: "votre entreprise",
    subtitle:
      "Solutions de câblage structuré, fibre optique et réseaux sans-fil conçues sur mesure pour garantir une connectivité fiable et performante.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    badge: "SOLUTIONS DURABLES",
    title: "L'énergie solaire au service",
    highlight: "de votre autonomie",
    subtitle:
      "Solutions d'alimentation solaire et systèmes de secours pour garantir la continuité de vos activités, même en cas de coupure.",
  },
];

// ===== TESTIMONIALS =====
export const testimonials: Testimonial[] = [
  {
    name: "Jean-Pierre B.",
    role: "Directeur Général",
    company: "Banque Commerciale de Bangui",
    content:
      "LA CANT a réalisé l'infrastructure réseau complète de notre nouveau siège. Un travail professionnel, dans les délais et avec un accompagnement technique irréprochable. Notre productivité a été transformée.",
    initials: "JP",
    rating: 5,
  },
  {
    name: "Marie K.",
    role: "Responsable Administratif",
    company: "Ministère des Finances",
    content:
      "Nous avons confié la sécurisation de nos données et l'installation de notre parc informatique à LA CANT. Leur expertise en cybersécurité nous a permis de passer aux normes internationales.",
    initials: "MK",
    rating: 5,
  },
  {
    name: "Dr. Ahmad T.",
    role: "Directeur Médical",
    company: "Clinique Saint-Joseph",
    content:
      "L'installation de notre système de téléphonie VoIP par LA CANT a considérablement amélioré la coordination entre nos services. Un gain de temps et d'efficacité remarquable.",
    initials: "AT",
    rating: 5,
  },
  {
    name: "Sophie N.",
    role: "CEO",
    company: "CentraLogistique SARL",
    content:
      "LA CANT nous accompagne depuis 3 ans pour la maintenance de nos infrastructures. Réactivité, compétence et professionnalisme sont au rendez-vous à chaque intervention.",
    initials: "SN",
    rating: 4,
  },
  {
    name: "Pierre D.",
    role: "Coordinateur Pays",
    company: "ONG Internationale",
    content:
      "Nous avons fait appel à LA CANT pour déployer des solutions solaires dans nos bureaux régionaux. Un travail de qualité qui a permis de réduire notre empreinte carbone et nos coûts.",
    initials: "PD",
    rating: 5,
  },
];

// ===== PARTNERS =====
export const partners: Partner[] = [
  {
    name: "Cisco",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/2560px-Cisco_logo_blue_2016.svg.png",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2560px-Microsoft_logo.svg.png",
  },
  {
    name: "Ubiquiti",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Ubiquiti_Logo.svg/2560px-Ubiquiti_Logo.svg.png",
  },
  {
    name: "Dell Technologies",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dell_Technologies_logo.svg/2560px-Dell_Technologies_logo.svg.png",
  },
  {
    name: "Siemens",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Siemens_logo.svg/2560px-Siemens_logo.svg.png",
  },
  {
    name: "Huawei",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Huawei_Standard_Logo.svg/2560px-Huawei_Standard_Logo.svg.png",
  },
];

// ===== PRODUCTS =====
export const products: Product[] = [
  {
    id: 1,
    name: "Routeur Professionnel Cisco ISR 1100",
    description:
      "Routeur haut de gamme pour PME avec VPN, pare-feu intégré et gestion à distance. Débit jusqu'à 1 Gbps.",
    price: 850000,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Réseau",
    features: [
      "Pare-feu intégré avec inspection profonde des paquets",
      "VPN site-à-site et VPN d'accès distant",
      "Qualité de service (QoS) pour priorisation du trafic",
      "Gestion à distance via interface web sécurisée",
      "Support IPv4/IPv6 dual-stack",
      "Alimentation redondante en option",
    ],
    specs: {
      "Débit maximal": "1 Gbps",
      "Ports LAN": "4 x Gigabit Ethernet",
      "Ports WAN": "2 x Gigabit Ethernet",
      "VPN tunnels": "200 simultanés",
      "Protocoles": "BGP, OSPF, EIGRP, RIP",
      "Sécurité": "IPSec, SSL VPN, Firewall Stateful",
      "Alimentation": "100-240V AC, 50-60Hz",
      "Dimensions": "44.5 x 33.5 x 4.4 cm",
      "Poids": "6.8 kg",
      "Garantie": "3 ans constructeur",
    },
    inStock: true,
  },
  {
    id: 2,
    name: "Switch Géré 48 Ports Gigabit",
    description:
      "Switch manageable 48 ports PoE+ avec 4 ports SFP+. Idéal pour les infrastructures d'entreprise.",
    price: 1200000,
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Réseau",
    features: [
      "48 ports PoE+ (30W par port, budget 740W)",
      "4 ports SFP+ 10 Gbps pour uplink fibre",
      "VLAN, STP, LACP, IGMP snooping",
      "ACL avancées et sécurité portuaire 802.1X",
      "SNMP v3, RMON pour supervision centralisée",
      "Stackable jusqu'à 8 unités",
    ],
    specs: {
      "Ports": "48 x Gigabit PoE+",
      "Ports SFP+": "4 x 10 Gbps",
      "Budget PoE": "740W",
      "Capacité de commutation": "176 Gbps",
      "Table MAC": "16 000 entrées",
      "VLAN": "4 094",
      "Latence": "< 3 μs",
      "Alimentation": "100-240V AC, 50-60Hz",
      "Niveau sonore": "45 dB",
      "Garantie": "5 ans",
    },
    inStock: true,
  },
  {
    id: 3,
    name: "Caméra IP Surveillance 4K",
    description:
      "Caméra de sécurité extérieure 4K avec vision nocturne, détection de mouvement et audio bidirectionnel.",
    price: 250000,
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Sécurité",
    features: [
      "Résolution 4K (3840x2160) en temps réel",
      "Vision nocturne infrarouge jusqu'à 50 mètres",
      "Détection de mouvement par IA (personnes, véhicules, animaux)",
      "Audio bidirectionnel avec microphone et haut-parleur intégrés",
      "Certification IP67 (étanche et anti-poussière)",
      "Alimentation PoE (un seul câble pour données et alimentation)",
    ],
    specs: {
      "Capteur": "1/2.5\" CMOS progressif 8 MP",
      "Résolution max": "3840x2160 @ 30 ips",
      "Objectif": "2.8 - 12 mm motorisé",
      "Angle de vue": "98° - 32°",
      "Vision nocturne": "50 m (IR intelligente)",
      "Compression": "H.265+/H.265/H.264",
      "Stockage": "MicroSD jusqu'à 256 Go, NAS, NVR",
      "Protocoles": "ONVIF, RTSP, HTTP, FTP",
      "Alimentation": "PoE 802.3af (12V DC en option)",
      "Garantie": "2 ans",
    },
    inStock: true,
  },
  {
    id: 4,
    name: "Kit Solaire 3000W",
    description:
      "Kit panneau solaire complet avec onduleur hybride, batteries lithium et régulateur MPPT. Idéal bureau.",
    price: 2500000,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Énergie",
    features: [
      "Onduleur hybride pur sinus 3000VA avec transfert automatique",
      "4 panneaux monocristallins 450W (rendement 21.5%)",
      "Batterie lithium LiFePO4 5kWh (6000 cycles)",
      "Régulateur MPPT 80A pour charge optimale",
      "Monitoring WiFi intégré (application mobile)",
      "Protection contre les surtensions, surcharges et décharges profondes",
    ],
    specs: {
      "Puissance crête": "3000 W (1800 W nominal)",
      "Tension batterie": "48V DC",
      "Capacité batterie": "5 000 Wh (LiFePO4)",
      "Panneaux solaires": "4 x 450W monocristallins",
      "Régulateur": "MPPT 80A",
      "Onduleur": "Pur sinus, 3000VA",
      "Transfert": "Automatique < 10 ms",
      "Temps de charge": "4-5 h (plein soleil)",
      "Application": "Monitoring WiFi iOS/Android",
      "Garantie": "5 ans",
    },
    inStock: true,
  },
  {
    id: 5,
    name: "Téléphone VoIP Cisco IP 8800",
    description:
      "Téléphone IP professionnel avec écran couleur HD, haut-parleur et compatibilité SIP.",
    price: 85000,
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599075484735-b3a73414f300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Téléphonie",
    features: [
      "Écran couleur HD 5 pouces (800x480)",
      "Compatibilité SIP standard (interopérable avec tous les PBX)",
      "Haut-parleur large bande avec annulation d'écho",
      "6 lignes programmables avec indicateurs LED",
      "Prise casque RJ9 et Bluetooth intégré",
      "Alimentation PoE (802.3af) ou adaptateur secteur",
    ],
    specs: {
      "Écran": "5\" couleur TFT 800x480",
      "Lignes": "6 touches programmables",
      "Audio": "Large bande HD, G.722, Opus",
      "Protocoles": "SIP 2.0 (RFC 3261)",
      "Codecs": "G.711, G.729, G.722, Opus",
      "Ports": "2 x Gigabit Ethernet (avec switch intégré)",
      "Bluetooth": "4.2 pour casque",
      "PoE": "802.3af (Classe 1)", 
      "Dimensions": "24.0 x 20.8 x 16.6 cm",
      "Garantie": "2 ans",
    },
    inStock: true,
  },
  {
    id: 6,
    name: "Serveur Dell PowerEdge T360",
    description:
      "Serveur tour d'entrée de gamme avec processeur Intel Xeon, 32 Go RAM, 2x1 To SSD.",
    price: 3200000,
    image:
      "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Informatique",
    features: [
      "Processeur Intel Xeon E-2436 (6 cœurs, 12 threads)",
      "32 Go DDR5 ECC (extensible à 128 Go)",
      "2 x 1 To SSD NVMe M.2 en RAID 1 (miroir)",
      "Baies d'extension : 4 x 3.5\" hot-swap",
      "iDRAC9 pour gestion à distance complète",
      "Alimentation redondante 600W (hot-plug)",
    ],
    specs: {
      "Processeur": "Intel Xeon E-2436 (6c/12t, 4.5 GHz Turbo)",
      "RAM": "32 Go DDR5 ECC 4800 MHz (max 128 Go)",
      "Stockage": "2 x 1 To SSD NVMe (RAID 1)",
      "Baies": "4 x 3.5\" SAS/SATA hot-swap",
      "RAID": "PERC H755 (RAID 0/1/5/10)",
      "Réseau": "2 x 1 GbE + 1 x iDRAC dédié",
      "USB": "4 x USB 3.2 + 1 x USB 2.0 interne",
      "Alimentation": "2 x 600W redondantes (80+ Platinum)",
      "OS supportés": "Windows Server, Linux (RHEL, Ubuntu, etc.)",
      "Garantie": "3 ans sur-site (NBD)",
    },
    inStock: true,
  },
  {
    id: 7,
    name: "Point d'Accès WiFi 6 Pro",
    description:
      "Point d'accès WiFi 6 (AX5400) pour couverture optimale des grands espaces. Jusqu'à 200 utilisateurs.",
    price: 185000,
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Réseau",
    isNew: true,
    features: [
      "WiFi 6 (802.11ax) jusqu'à 5.4 Gbps agrégés",
      "Double bande simultanée 2.4 GHz / 5 GHz",
      "Jusqu'à 200 clients simultanés",
      "Mesh intégré pour extension sans fil",
      "Alimentation PoE+ (802.3at) incluse",
      "Gestion centralisée via contrôleur cloud ou on-premise",
    ],
    specs: {
      "Standard": "WiFi 6 (802.11ax)",
      "Débit agrégé": "5.4 Gbps",
      "Bandes": "2.4 GHz (600 Mbps) + 5 GHz (4.8 Gbps)",
      "Clients max": "200",
      "Port réseau": "1 x 2.5 GbE PoE+",
      "MIMO": "4x4 (5 GHz) + 2x2 (2.4 GHz)",
      "Sécurité": "WPA3, 802.1X, RADIUS",
      "Portée": "Jusqu'à 50 m (intérieur)",
      "Alimentation": "PoE+ 802.3at (24V DC en option)",
      "Garantie": "3 ans",
    },
    inStock: true,
  },
  {
    id: 8,
    name: "Contrôle d'Accès Biométrique",
    description:
      "Scanner d'empreintes digitales et badges RFID pour sécuriser l'accès à vos locaux. Jusqu'à 10 000 utilisateurs.",
    price: 450000,
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Sécurité",
    isNew: true,
    features: [
      "Reconnaissance d'empreintes digitales (capteur optique 500 DPI)",
      "Badges RFID 13.56 MHz (MIFARE, DESFire)",
      "Capacité : 10 000 utilisateurs, 100 000 événements",
      "Écran tactile TFT 2.8 pouces couleur",
      "Communication TCP/IP et WiFi intégrée",
      "Batterie de secours 4h incluse",
    ],
    specs: {
      "Capteur": "Optique 500 DPI, anti-falsification",
      "Identification": "Empreinte (< 0.5s) ou badge RFID",
      "Capacité utilisateurs": "10 000",
      "Historique événements": "100 000",
      "Écran": "2.8\" TFT couleur tactile",
      "Communication": "TCP/IP, WiFi 2.4 GHz, RS485",
      "Sortie relais": "1 x relais NO/NF (12V/3A)",
      "Alimentation": "12V DC (adaptateur inclus)",
      "Batterie": "Lithium 4h de secours",
      "Indice de protection": "IP55 (extérieur)",
      "Garantie": "2 ans",
    },
    inStock: true,
  },
  {
    id: 9,
    name: "Onduleur Online 3000 VA",
    description:
      "Onduleur double conversion pour protection critique des serveurs et équipements sensibles. Autonomie 30 min.",
    price: 650000,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    category: "Énergie",
    isNew: true,
    features: [
      "Technologie double conversion en ligne (VFI) — protection maximale",
      "Onde sinusoïdale pure — compatible avec tous les équipements",
      "Autonomie 30 min à pleine charge (extensible avec baies supplémentaires)",
      "Ecran LCD avec indicateurs de charge, batterie et alarmes",
      "Ports de communication : USB, RS232, slot SNMP",
      "Stabilisateur de tension intégré (AVR) — idéal pour zones instables",
    ],
    specs: {
      "Puissance": "3000 VA / 2700 W",
      "Topologie": "Double conversion en ligne (VFI SS 111)",
      "Onde": "Sinusoïdale pure",
      "Tension entrée": "160-300 VAC (adaptative)",
      "Tension sortie": "220/230/240 VAC ± 1%",
      "Batteries": "6 x 12V/9Ah (interne)",
      "Autonomie": "30 min (pleine charge) / 60 min (demi-charge)",
      "Recharge": "4-6 h (80%)",
      "Prises": "6 x IEC C13 + 1 x IEC C19",
      "Communication": "USB, RS232, slot SNMP optionnel",
      "Garantie": "3 ans (2 ans batteries)",
    },
    inStock: true,
  },
];
