import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MessageCircle, Send, Bot, ShoppingBag, Video, Calendar, Paperclip, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteContext';
import type { Product } from '../context/SiteContext';

function WhatsAppIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
};

type QuickAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
};

type ProductKeyword = {
  keywords: string[];
  matchFn: (product: Product, lower: string) => boolean;
  label: string;
};

type AppointmentStep = 'date' | 'time' | 'name' | 'confirm' | null;

const productKeywords: ProductKeyword[] = [
  { keywords: ['ciment'], label: 'ciment', matchFn: (_, lower) => lower.includes('ciment') },
  { keywords: ['fer', 'acier', 'armature', 'barre'], label: 'fer à béton', matchFn: (_, lower) =>
    lower.includes('fer') || lower.includes('acier') || lower.includes('armature') || lower.includes('barre') },
  { keywords: ['brique', 'parpaing', 'agglo'], label: 'briques', matchFn: (_, lower) =>
    lower.includes('brique') || lower.includes('parpaing') || lower.includes('agglo') },
  { keywords: ['sable'], label: 'sable', matchFn: (_, lower) => lower.includes('sable') },
  { keywords: ['gravier', 'caillou', 'granulat'], label: 'gravier', matchFn: (_, lower) =>
    lower.includes('gravier') || lower.includes('caillou') || lower.includes('granulat') },
  { keywords: ['tôle', 'toles', 'bac acier', 'couverture'], label: 'tôles', matchFn: (_, lower) =>
    lower.includes('tôle') || lower.includes('toles') || lower.includes('bac acier') || lower.includes('couverture') },
  { keywords: ['pompe', 'pmh'], label: 'pompe', matchFn: (_, lower) =>
    lower.includes('pompe') || lower.includes('pmh') },
  { keywords: ['château', 'chateau', 'réservoir', 'citerme'], label: "château d'eau", matchFn: (_, lower) =>
    lower.includes('château') || lower.includes('chateau') || lower.includes('réservoir') || lower.includes('citerme') },
];

const suggestions = [
  "Quels sont vos services ?",
  "Quels matériaux vendez-vous ?",
  "Pouvez-vous me faire un devis ?",
  "Quelles sont vos réalisations ?",
];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getDateSuggestions(): { label: string; date: Date; value: string }[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const afterTomorrow = new Date(today);
  afterTomorrow.setDate(afterTomorrow.getDate() + 2);

  return [
    { label: `Aujourd'hui (${today.toLocaleDateString('fr-FR', { weekday: 'long' })})`, date: today, value: today.toISOString().split('T')[0] },
    { label: `Demain (${tomorrow.toLocaleDateString('fr-FR', { weekday: 'long' })})`, date: tomorrow, value: tomorrow.toISOString().split('T')[0] },
    { label: `Après-demain (${afterTomorrow.toLocaleDateString('fr-FR', { weekday: 'long' })})`, date: afterTomorrow, value: afterTomorrow.toISOString().split('T')[0] },
  ];
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "👋 Bonjour ! Bienvenue chez CTBA. Comment pouvons-nous vous aider ?",
      sender: 'bot',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOrderButton, setShowOrderButton] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState<AppointmentStep>(null);
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '', name: '' });
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const navigate = useNavigate();
  const { settings, products, projects, services } = useSiteData();

  const phone1Clean = settings.contact.phone1.replace(/\s/g, '');
  const phone2Clean = settings.contact.phone2.replace(/\s/g, '');
  const whatsappNumber = phone1Clean.replace('+', '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const whatsappVideoUrl = `https://wa.me/${whatsappNumber}?text=Bonjour%20CTBA%2C%20je%20souhaite%20faire%20un%20appel%20vid%C3%A9o%20pour%20discuter%20de%20mon%20projet.`;
  const isFirstInteraction = messages.length === 1;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);       // D5
      osc.frequency.linearRampToValueAtTime(783.99, now + 0.1); // G5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Échec silencieux si l'audio n'est pas disponible
    }
  };

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `bot-${Date.now()}`, text, sender: 'bot' },
    ]);
    playNotificationSound();
  };

  const findSpecificProduct = (lower: string): Product | null => {
    for (const entry of productKeywords) {
      if (entry.matchFn({} as Product, lower)) {
        const match = products.find((p) =>
          entry.keywords.some((kw) => p.name.toLowerCase().includes(kw))
        );
        if (match) return match;
        for (const kw of entry.keywords) {
          const found = products.find((p) => p.name.toLowerCase().includes(kw));
          if (found) return found;
        }
      }
    }
    return null;
  };

  const formatProductLine = (p: Product): string => {
    const stock = p.inStock ? '✅ En stock' : '❌ Rupture';
    return `  • ${p.name}\n    💰 ${p.price} — ${stock}`;
  };

  const handleAppointmentDate = (dateValue: string) => {
    const date = new Date(dateValue + 'T12:00:00');
    setAppointmentData((prev) => ({ ...prev, date: formatDate(date) }));
    setAppointmentStep('time');
    addBotMessage(
      `📅 Parfait pour le ${formatDate(date)} !\n\nÀ quelle heure préférez-vous ? Voici nos créneaux disponibles :`
    );
  };

  const handleAppointmentTime = (time: string) => {
    setAppointmentData((prev) => ({ ...prev, time }));
    setAppointmentStep('name');
    addBotMessage(
      `🕐 ${time} — bien noté !\n\nPour finaliser, pourriez-vous me donner votre prénom et nom ?`
    );
  };

  const handleAppointmentName = (name: string) => {
    setAppointmentData((prev) => ({ ...prev, name }));
    setAppointmentStep('confirm');
    const details = appointmentData;
    const msg = `✅ **Rendez-vous confirmé !**\n\n📅 Date : ${details.date || '(à définir)'}\n🕐 Heure : ${details.time || '(à définir)'}\n👤 Nom : ${name}\n\nCliquez sur le bouton WhatsApp ci-dessous pour confirmer avec notre équipe.`;
    addBotMessage(msg);
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérification de la taille
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      addBotMessage(
        `⚠️ Le fichier **${file.name}** (${sizeMB} Mo) dépasse la limite de **10 Mo**.\n\n` +
        "Veuillez choisir un fichier plus léger ou le compresser avant de le joindre."
      );
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
      });

      // Ajouter le message utilisateur
      const isImage = file.type.startsWith('image/');
      const fileLabel = isImage ? `📷 ${file.name}` : `📎 ${file.name}`;
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, text: fileLabel, sender: 'user' },
      ]);
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  const sendFileOnWhatsApp = () => {
    if (!selectedFile) return;
    const msg = `Bonjour CTBA, je vous envoie ce fichier : ${selectedFile.name}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const resetAppointmentFlow = () => {
    setAppointmentStep(null);
    setAppointmentData({ date: '', time: '', name: '' });
  };

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;

    const lower = text.toLowerCase();
    const trimmed = text.trim();

    // ——— Gestion du flow rendez-vous ———
    if (appointmentStep === 'date') {
      // Détecter si l'utilisateur a tapé une date (aujourd'hui, demain, etc.)
      if (lower.includes('aujourd') || lower.includes("aujourd'hui")) {
        const today = new Date();
        handleAppointmentDate(today.toISOString().split('T')[0]);
      } else if (lower.includes('demain')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        handleAppointmentDate(tomorrow.toISOString().split('T')[0]);
      } else if (lower.includes('après') || lower.includes('apres')) {
        const after = new Date();
        after.setDate(after.getDate() + 2);
        handleAppointmentDate(after.toISOString().split('T')[0]);
      } else {
        // Essayer de parser une date
        const parsed = new Date(trimmed);
        if (!isNaN(parsed.getTime())) {
          handleAppointmentDate(parsed.toISOString().split('T')[0]);
        } else {
          addBotMessage("Je n'ai pas bien compris la date. Pouvez-vous choisir parmi les suggestions ci-dessous ?");
        }
      }
      setInputValue('');
      return;
    }

    if (appointmentStep === 'time') {
      // Check if the user typed a valid time
      const timeMatch = trimmed.match(/(\d{1,2})[h:](\d{2})/);
      if (timeMatch) {
        handleAppointmentTime(`${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`);
      } else if (timeSlots.includes(trimmed)) {
        handleAppointmentTime(trimmed);
      } else {
        addBotMessage("Veuillez choisir un créneau parmi les suggestions ci-dessous (ex: 09:00, 14:00).");
      }
      setInputValue('');
      return;
    }

    if (appointmentStep === 'name') {
      if (trimmed.length >= 2) {
        handleAppointmentName(trimmed);
      } else {
        addBotMessage("Veuillez entrer un nom valide (au moins 2 caractères).");
      }
      setInputValue('');
      return;
    }

    // ——— Si un flow est actif, ne pas traiter les autres réponses ———
    if (appointmentStep === 'confirm') {
      resetAppointmentFlow();
    }

    // ——— Message normal ———
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, text, sender: 'user' },
    ]);
    setInputValue('');
    setIsTyping(true);
    setShowOrderButton(false);

    setTimeout(() => {
      setIsTyping(false);

      // ——— Photo / Fichier ———
      if (
        lower.includes('photo') || lower.includes('image') || lower.includes('fichier') ||
        lower.includes('joindre') || lower.includes('pièce jointe') ||
        lower.includes('importer') || lower.includes('upload') ||
        lower.includes('capture') || lower.includes('écran')
      ) {
        addBotMessage(
          "📎 Vous pouvez joindre une photo ou un fichier en cliquant sur l'icône trombone 📎 à côté du champ de saisie." +
          "\n\nFormats acceptés : images (JPG, PNG), documents (PDF, Word, Excel)." +
          "\n\nUne fois le fichier sélectionné, vous pourrez l'envoyer directement sur WhatsApp."
        );
        return;
      }

      // ——— Rendez-vous / Planification ———
      if (
        lower.includes('rendez-vous') || lower.includes('rdv') ||
        lower.includes('planifier') || lower.includes('prendre rdv') ||
        lower.includes('rencard') || lower.includes('calendrier')
      ) {
        setAppointmentStep('date');
        addBotMessage(
          "📅 Je serais ravi de vous planifier un rendez-vous avec notre équipe !\n\nQuel jour préférez-vous ?"
        );
        return;
      }

      // ——— Produit spécifique ———
      const isAskingPrice = lower.includes('prix') || lower.includes('tarif') || lower.includes('coût') || lower.includes('combien');
      const specificProduct = findSpecificProduct(lower);
      if (specificProduct && isAskingPrice) {
        const stockNote = specificProduct.inStock
          ? 'disponible en stock'
          : 'actuellement en rupture';
        addBotMessage(
          `💰 **${specificProduct.name}**\n\n` +
          `Prix : **${specificProduct.price}**\n` +
          `Catégorie : ${specificProduct.category}\n` +
          `Statut : ${stockNote}\n\n` +
          `${specificProduct.description}`
        );
        setShowOrderButton(true);
        return;
      }

      // ——— Produits et matériaux (liste complète) ———
      if (
        lower.includes('produit') || lower.includes('matériau') ||
        lower.includes('ciment') || lower.includes('fer') ||
        lower.includes('brique') || lower.includes('sable') ||
        lower.includes('gravier') || lower.includes('tôle') ||
        lower.includes('achat') || lower.includes('commander') ||
        lower.includes('boutique') || lower.includes('magasin') ||
        lower.includes('prix') || lower.includes('tarif') || lower.includes('coût') ||
        lower.includes('catalogue') || lower.includes('stock')
      ) {
        const inStock = products.filter((p) => p.inStock);
        const outOfStock = products.filter((p) => !p.inStock);
        const allProducts = [...inStock, ...outOfStock];

        const productList = allProducts
          .map((p) => formatProductLine(p))
          .join('\n');

        const stats = `📦 **${inStock.length}** produits en stock sur **${products.length}**`;
        addBotMessage(
          "🏪 **Catalogue CTBA — Prix mis à jour**\n\n" +
          productList +
          `\n\n${stats}` +
          "\n\nLes prix peuvent varier selon la quantité."
        );
        setShowOrderButton(true);
        return;
      }

      // ——— Réalisations / Projets ———
      if (
        lower.includes('réalisation') || lower.includes('projet') ||
        lower.includes('chantier') || lower.includes('ouvrage') ||
        lower.includes('travaux') || lower.includes('réalisé')
      ) {
        const projectList = projects
          .slice(0, 4)
          .map((p) => `  • ${p.title} (${p.category}, ${p.date})`)
          .join('\n');
        addBotMessage(
          "🏆 Voici quelques-unes de nos réalisations :\n\n" +
          projectList +
          "\n\n👉 Consultez notre page Réalisations pour plus de détails et des photos."
        );
        return;
      }

      // ——— Présentation de l'entreprise ———
      if (
        lower.includes('ctba') || lower.includes('entreprise') ||
        lower.includes('société') || lower.includes('qui êtes') ||
        lower.includes('présente') || lower.includes('à propos')
      ) {
        addBotMessage(
          "🏢 CTBA (Comptoir Ti Be Africa) est une entreprise centrafricaine spécialisée dans :\n\n" +
          "  • Forages et hydraulique (eau potable, pompes, châteaux d'eau)\n" +
          "  • Construction et BTP (bâtiments, génie civil, rénovation)\n" +
          "  • Commerce général (matériaux, équipements, import-export)\n\n" +
          "📍 Basée à Bangui, nous intervenons partout en République Centrafricaine."
        );
        return;
      }

      // ——— Devis ———
      if (
        lower.includes('devis') || lower.includes('estimation') ||
        lower.includes('budget') || lower.includes('combien')
      ) {
        addBotMessage(
          "📋 Pour obtenir un devis personnalisé, vous pouvez :\n\n" +
          `  📞 Nous appeler au ${settings.contact.phone1}\n` +
          `  💬 Nous contacter sur WhatsApp\n` +
          `  ✉️ Nous envoyer un email à ${settings.contact.email}\n\n` +
          "Nos conseillers vous répondront sous 24h ouvrées."
        );
        return;
      }

      // ——— Visio / Appel vidéo ———
      if (
        lower.includes('visio') || lower.includes('vidéo') || lower.includes('video') ||
        lower.includes('appel visio') || lower.includes('appel vidéo') ||
        lower.includes('caméra') || lower.includes('camera') || lower.includes('zoom')
      ) {
        addBotMessage(
          "📹 Nous proposons des rendez-vous en visioconférence !\n\n" +
          "Pour un appel vidéo, contactez-nous sur WhatsApp en cliquant sur le bouton **'Visio WhatsApp'** ci-dessous.\n\n" +
          "Préparez votre numéro de téléphone et nous vous rappellerons pour un échange en direct. Nos conseillers sont disponibles du lundi au vendredi, de 8h à 17h."
        );
        return;
      }

      // ——— Contact ———
      if (
        lower.includes('contact') || lower.includes('téléphone') ||
        lower.includes('appeler') || lower.includes('whatsapp') ||
        lower.includes('email') || lower.includes('adresse') ||
        lower.includes('où')
      ) {
        addBotMessage(
          "📞 Voici nos coordonnées :\n\n" +
          `  • Téléphone : ${settings.contact.phone1}\n` +
          `  • Téléphone : ${settings.contact.phone2}\n` +
          `  • Email : ${settings.contact.email}\n` +
          `  • Adresse : ${settings.contact.address}\n\n` +
          "Utilisez les boutons d'action rapide ci-dessous pour nous appeler ou nous écrire directement."
        );
        return;
      }

      // ——— Services / domaines d'intervention ———
      if (
        lower.includes('service') || lower.includes('domaine') ||
        lower.includes('intervention') || lower.includes('activité') ||
        lower.includes('expertise')
      ) {
        const serviceList = services
          .map((s) => `  • ${s.title}`)
          .join('\n');
        addBotMessage(
          "🔧 CTBA intervient dans trois domaines principaux :\n\n" +
          serviceList +
          "\n\n👉 Cliquez sur 'Nos services' ci-dessous pour découvrir le détail de chaque activité."
        );
        return;
      }

      // ——— Forage / Eau ———
      if (lower.includes('forage') || lower.includes('eau') || lower.includes('pompe')) {
        addBotMessage(
          "💧 Nous réalisons des forages d'eau potable, installons des pompes manuelles et solaires, et construisons des châteaux d'eau.\n\n" +
          "Nos services incluent :\n" +
          "  • Études hydrogéologiques\n" +
          "  • Forages d'eau potable\n" +
          "  • Pompes manuelles (PMH) et solaires\n" +
          "  • Châteaux d'eau et adduction\n\n" +
          "Souhaitez-vous un devis personnalisé ?"
        );
        return;
      }

      // ——— Construction / BTP ———
      if (lower.includes('construction') || lower.includes('btp') || lower.includes('bâtiment')) {
        addBotMessage(
          "🏗️ CTBA construit des bâtiments administratifs, résidentiels et réalise des travaux de génie civil.\n\n" +
          "Nos prestations :\n" +
          "  • Bâtiments administratifs et résidentiels\n" +
          "  • Travaux de génie civil\n" +
          "  • Réhabilitation et rénovation\n" +
          "  • Maçonnerie, plomberie, électricité\n\n" +
          "Cliquez sur 'Nos services' ci-dessous pour pour en savoir plus."
        );
        return;
      }

      // ——— Salutations ———
      if (
        lower.includes('bonjour') || lower.includes('salut') ||
        lower.includes('hello') || lower.includes('bonsoir') ||
        lower.includes('merci')
      ) {
        addBotMessage("Bonjour 🙏 Que puis-je faire pour vous aujourd'hui ?");
        return;
      }

      // ——— Réponse par défaut ———
      addBotMessage(
        "Merci pour votre message ! Je peux vous renseigner sur :\n\n" +
        "  🏗️ Nos services (forage, construction, commerce)\n" +
        "  🏆 Nos réalisations\n" +
        "  🛒 Nos produits et matériaux\n" +
        "  📞 Nos coordonnées\n\n" +
        "Ou utilisez les actions rapides ci-dessous pour nous contacter directement."
      );
    }, 800);
  };

  const handleSuggestionClick = (text: string) => {
    handleUserMessage(text);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'appointment',
      label: 'Prendre RDV',
      icon: <Calendar size={20} />,
      action: () => {
        setAppointmentStep('date');
        addBotMessage(
          "📅 Je serais ravi de vous planifier un rendez-vous avec notre équipe !\n\nQuel jour préférez-vous ?"
        );
      },
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
    {
      id: 'call1',
      label: `Appeler ${settings.contact.phone1}`,
      icon: <Phone size={20} />,
      action: () => { window.location.href = `tel:${phone1Clean}`; },
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <WhatsAppIcon size={20} />,
      action: () => { window.open(whatsappUrl, '_blank'); },
      color: 'bg-[#25D366] hover:bg-[#1ebe5a]',
    },
    {
      id: 'video',
      label: 'Visio WhatsApp',
      icon: <Video size={20} />,
      action: () => { window.open(whatsappVideoUrl, '_blank'); },
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      id: 'email',
      label: 'Email',
      icon: <Mail size={20} />,
      action: () => { window.location.href = `mailto:${settings.contact.email}`; },
      color: 'bg-brand-600 hover:bg-brand-700',
    },
    {
      id: 'shop',
      label: 'Boutique',
      icon: <ShoppingBag size={20} />,
      action: () => { navigate('/boutique'); setIsOpen(false); },
      color: 'bg-amber-600 hover:bg-amber-700',
    },
    {
      id: 'services',
      label: 'Nos services',
      icon: <MessageCircle size={20} />,
      action: () => { navigate('/services'); setIsOpen(false); },
      color: 'bg-slate-700 hover:bg-slate-800',
    },
  ];

  const handleQuickAction = (action: QuickAction) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, text: action.label, sender: 'user' },
    ]);
    action.action();
  };

  const dateSuggestions = getDateSuggestions();

  const bookingWhatsAppUrl = appointmentData.date && appointmentData.time && appointmentData.name
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Bonjour CTBA, je confirme mon rendez-vous :\n\n📅 Date : ${appointmentData.date}\n🕐 Heure : ${appointmentData.time}\n👤 Nom : ${appointmentData.name}\n\nMerci de me confirmer la disponibilité.`
      )}`
    : whatsappUrl;

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-brand-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
        title="Chatbot CTBA"
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <>
            <Bot size={22} />
            <span className="hidden sm:inline font-medium text-sm">Chatbot</span>
          </>
        )}
        <span className="absolute inset-0 rounded-full bg-brand-600 animate-ping opacity-20 group-hover:opacity-30" style={{ animationDuration: '2s' }} />
      </button>

      {/* Panneau du chatbot */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-40 w-auto sm:w-[360px] max-h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Assistant CTBA</h3>
                  <p className="text-xs text-brand-100">En ligne</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 min-h-[140px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'bot'
                        ? 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm'
                        : 'bg-brand-600 text-white rounded-br-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Suggestions de dates (étape date) */}
              {appointmentStep === 'date' && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {dateSuggestions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleAppointmentDate(s.value)}
                      className="text-xs px-3.5 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-full hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Créneaux horaires (étape time) */}
              {appointmentStep === 'time' && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleAppointmentTime(t)}
                      className="text-xs px-3.5 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-full hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      🕐 {t}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Bouton de confirmation WhatsApp (étape confirm) */}
              {appointmentStep === 'confirm' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-1"
                >
                  <button
                    onClick={() => { window.open(bookingWhatsAppUrl, '_blank'); resetAppointmentFlow(); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-xl font-medium text-xs shadow-sm hover:bg-[#1ebe5a] hover:shadow-md active:scale-95 transition-all duration-200"
                  >
                    <WhatsAppIcon size={16} />
                    Confirmer sur WhatsApp
                  </button>
                </motion.div>
              )}

              {/* Suggestions cliquables */}
              {isFirstInteraction && !isTyping && !appointmentStep && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs px-3.5 py-2 bg-white border border-brand-200 text-brand-700 rounded-full hover:bg-brand-50 hover:border-brand-300 hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Aperçu du fichier sélectionné */}
              {selectedFile && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    {selectedFile.type.startsWith('image/') ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={selectedFile.dataUrl}
                          alt={selectedFile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Paperclip size={20} className="text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{selectedFile.name}</p>
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} Ko
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { sendFileOnWhatsApp(); setSelectedFile(null); }}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-[#25D366] text-white rounded-lg text-xs font-medium hover:bg-[#1ebe5a] transition-colors active:scale-[0.98]"
                  >
                    <WhatsAppIcon size={14} />
                    Envoyer sur WhatsApp
                  </button>
                </motion.div>
              )}

              {/* Bouton Passer commande */}
              {showOrderButton && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-1"
                >
                  <button
                    onClick={() => { navigate('/boutique'); setIsOpen(false); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-medium text-xs shadow-sm hover:bg-amber-600 hover:shadow-md active:scale-95 transition-all duration-200"
                  >
                    <ShoppingBag size={16} />
                    Passer commande
                  </button>
                </motion.div>
              )}

              {/* Indicateur de saisie */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 shadow-sm border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Actions rapides */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-t border-slate-100 space-y-1.5 sm:space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions rapides</p>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white text-xs font-medium transition-colors ${action.color}`}
                  >
                    {action.icon}
                    <span className="truncate">
                      {action.id === 'call1' ? 'Appel' : action.id === 'appointment' ? 'RDV' : action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 pt-2 bg-white border-t border-slate-100">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserMessage(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors shrink-0"
                  title="Prendre une photo"
                >
                  <Camera size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors shrink-0"
                  title="Joindre un fichier ou une photo"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={appointmentStep === 'name' ? "Votre prénom et nom..." : "Posez votre question..."}
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
