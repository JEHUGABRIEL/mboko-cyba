import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  Wine,
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useContactModal } from '../context/ContactModalContext';

const heroSlides = [
  {
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80',
    alt: 'Bar lounge KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
    alt: 'Cocktail bar'
  },
  {
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    alt: 'Ambiance feutrée'
  }
];

const signatureCocktails = [
  {
    name: 'KM Sunset',
    desc: 'Rhum, jus de fruits de la passion, sirop de gingembre, menthe fraîche',
    price: '5 000 XAF'
  },
  {
    name: 'Bangui Mule',
    desc: 'Vodka, ginger beer locale, citron vert, angostura',
    price: '4 500 XAF'
  },
  {
    name: 'Sangria Tropicale',
    desc: 'Vin rouge, fruits exotiques, cannelle, eau gazeuse',
    price: '4 000 XAF'
  },
  {
    name: 'Mocktail Hibiscus',
    desc: "Infusion d'hibiscus, citronnelle, sirop de miel, eau pétillante (sans alcool)",
    price: '3 000 XAF'
  }
];

export function BarPage() {
  const { openModal } = useContactModal();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url("${slide.image}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              opacity: index === current ? 1 : 0
            }}
          >
            <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/85" />
          </div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-brand-300 font-medium tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
              Détente & Ambiance
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight">
              Bar Lounge
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light">
              Un cadre feutré et cosy pour vos moments de détente, avec une sélection pointue de cocktails, vins et spiritueux.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* ===== BAR LOUNGE SECTION ===== */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")`
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Wine className="w-6 h-6 text-brand-400" />
                <span className="text-brand-400 font-medium tracking-widest uppercase text-sm">
                  Bar Lounge
                </span>
              </div>
              <h3 className="text-4xl font-serif mb-6 leading-tight">
                L'Art de la Détente
              </h3>
              <p className="text-slate-300 font-light leading-relaxed mb-6">
                En fin de journée, notre Bar Lounge vous accueille dans une
                atmosphère feutrée et cosy. Canapés profonds, éclairage tamisé,
                musique d'ambiance : l'endroit idéal pour se détendre après une
                journée de travail ou de découverte.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 text-brand-400" />
                  <span>17:00 - 00:00</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <span>Rez-de-chaussée</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
                alt="Cocktail bar"
                className="w-full h-56 object-cover rounded-sm mt-6"
              />
              <img
                src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80"
                alt="Bar ambiance"
                className="w-full h-56 object-cover rounded-sm"
              />
            </motion.div>
          </div>

          {/* Cocktails */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-2xl font-serif text-center mb-10">
              Notre Carte de Cocktails
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {signatureCocktails.map((cocktail) => (
                <div
                  key={cocktail.name}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6 hover:bg-white/10 transition-colors duration-300"
                >
                  <Sparkles className="w-5 h-5 text-brand-400 mb-3" />
                  <h5 className="text-lg font-serif text-white mb-2">
                    {cocktail.name}
                  </h5>
                  <p className="text-sm text-slate-400 font-light mb-3">
                    {cocktail.desc}
                  </p>
                  <span className="text-brand-400 font-medium text-sm">
                    {cocktail.price}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== BAR CTA ===== */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Vivez l'Ambiance du Bar
            </h2>
            <p className="text-slate-400 font-light text-lg mb-10 max-w-2xl mx-auto">
              Que ce soit pour un afterwork entre collègues, un rendez-vous en amoureux
              ou une soirée entre amis, venez découvrir notre sélection de cocktails signatures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openModal}
                className="px-8 py-4 bg-brand-600 text-white font-medium tracking-wide hover:bg-brand-700 transition-colors"
              >
                Réserver une table
              </button>
              <a
                href="tel:+23675494969"
                className="flex items-center gap-2 px-8 py-4 border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                +236 75 49 49 69
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
