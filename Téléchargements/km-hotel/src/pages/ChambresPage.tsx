import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  Tv,
  Snowflake,
  Bath,
  Coffee,
  Users,
  Bed,
  Square,
  ChevronDown,
  Shield,
  Zap,
  Droplets,
  Phone,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDataBuilder } from '../hooks/useDataBuilder';
import { DetailModal, type RoomDetail } from '../components/DetailModal';
import { useContactModal } from '../context/ContactModalContext';

const FEATURE_COUNTS = [8, 9]; // features per room

const roomImages = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80'
];

const heroSlides = [
  {
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
    alt: 'Chambre luxueuse KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80',
    alt: 'Chambre Confort KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80',
    alt: 'Chambre Deluxe KM Hotel'
  }
];

const amenityIcons = [
  <Zap className="w-5 h-5" />,
  <Droplets className="w-5 h-5" />,
  <Wifi className="w-5 h-5" />,
  <Tv className="w-5 h-5" />,
  <Snowflake className="w-5 h-5" />,
  <Shield className="w-5 h-5" />,
  <Coffee className="w-5 h-5" />,
  <Bath className="w-5 h-5" />
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

function buildRoomsData(t: (key: string) => string): RoomDetail[] {
  return [0, 1].map((i) => ({
    type: 'room' as const,
    name: t(`chambres.rooms.${i}.name`),
    price: t(`chambres.rooms.${i}.price`),
    size: t(`chambres.rooms.${i}.size`),
    capacity: t(`chambres.rooms.${i}.capacity`),
    bed: t(`chambres.rooms.${i}.bed`),
    description: t(`chambres.rooms.${i}.description`),
    features: Array.from({ length: FEATURE_COUNTS[i] }, (_, d) =>
      t(`chambres.rooms.${i}.features.${d}`)
    ),
    image: roomImages[i],
    badge: t(`chambres.rooms.${i}.badge`)
  }));
}

function buildAmenities(t: (key: string) => string) {
  return [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
    icon: amenityIcons[i],
    label: t(`chambres.amenities.${i}.label`)
  }));
}

function RoomCard({ room, index, onBook }: { room: RoomDetail; index: number; onBook: () => void }) {
  const { t } = useTranslation();
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setSelectedRoom(room)}
        className="group cursor-pointer bg-white rounded-sm overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500"
      >
        {/* Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
              {room.badge}
            </span>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-sm text-slate-800 text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Eye className="w-4 h-4" />
              {t('chambres.detailButton')}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h4 className="text-lg font-serif text-slate-900 group-hover:text-brand-600 transition-colors duration-300 mb-1">
            {room.name}
          </h4>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 mb-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Square className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              {room.size}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              {room.capacity}
            </span>
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              {room.bed}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-2 mb-3">
            {room.description}
          </p>

          {/* Features (first 3) */}
          <div className="space-y-1.5 mb-4">
            {room.features.slice(0, 3).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                <span className="font-light truncate">{feature}</span>
              </div>
            ))}
          </div>

          {/* Price + Buttons */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2">
            <span className="text-lg font-serif text-brand-600 whitespace-nowrap">
              {room.price}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedRoom(room); }}
                className="px-3 py-2 border border-brand-600 text-brand-600 text-[11px] font-medium uppercase tracking-wider hover:bg-brand-50 transition-colors whitespace-nowrap"
              >
                {t('chambres.detailButton')}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onBook(); }}
                className="px-3 py-2 bg-brand-600 text-white text-[11px] font-medium uppercase tracking-wider hover:bg-brand-700 transition-colors whitespace-nowrap"
              >
                {t('chambres.bookButton')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <DetailModal item={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </>
  );
}

export function ChambresPage() {
  const { t } = useTranslation();
  const { openModal } = useContactModal();
  const [current, setCurrent] = useState(0);

  const rooms = useDataBuilder(buildRoomsData, t);
  const amenities = useDataBuilder(buildAmenities, t);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== HERO ===== */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Slides */}
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
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/80" />
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
              {t('chambres.hero.badge')}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight">
              {t('chambres.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light">
              {t('chambres.hero.subtitle')}
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

      {/* ===== INTRODUCTION ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
            <h2 className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3">
              {t('chambres.intro.badge')}
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 mb-6">
              {t('chambres.intro.title')}
            </h3>
            <p className="text-slate-600 font-light leading-relaxed">
              {t('chambres.intro.text')}
            </p>
          </motion.div>

          {/* Amenities bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {amenities.map((amenity, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-sm border border-slate-100 hover:bg-brand-50 hover:border-brand-200 transition-all duration-300 group"
              >
                <div className="text-brand-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {amenity.icon}
                </div>
                <span className="text-xs text-slate-600 font-medium leading-tight">
                  {amenity.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== ROOMS GRID ===== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {rooms.map((room, index) => (
              <RoomCard key={room.name} room={room} index={index} onBook={openModal} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
              {t('chambres.cta.title')}
            </h2>
            <p className="text-slate-300 font-light text-lg mb-10 max-w-2xl mx-auto">
              {t('chambres.cta.text')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openModal}
                className="px-8 py-4 bg-brand-600 text-white font-medium tracking-wide hover:bg-brand-700 transition-colors"
              >
                {t('chambres.cta.button')}
              </button>
              <a
                href="tel:+23675494969"
                className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 transition-colors"
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
