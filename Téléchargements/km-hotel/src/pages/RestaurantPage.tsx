import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  UtensilsCrossed,
  Coffee,
  Star,
  Phone,
  Eye
} from 'lucide-react';
import { DetailModal, type DishDetail } from '../components/DetailModal';
import { useContactModal } from '../context/ContactModalContext';

const heroSlides = [
  {
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    alt: 'Restaurant KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80',
    alt: 'Salle à manger KM Hotel'
  },
  {
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80',
    alt: 'Plat gastronomique KM Hotel'
  }
];

const dishImages = [
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80'
];

const highlightImages = [
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80'
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

function DishCard({ dish, index }: { dish: DishDetail; index: number }) {
  const { t } = useTranslation();
  const [selectedDish, setSelectedDish] = useState<DishDetail | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  // Alternate between 2 dish images on a timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Use dish image + a complementary food image for each card
  const dishSlideImages = [
    dish.image,
    dishImages[(index + 2) % dishImages.length]
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setSelectedDish(dish)}
        className="group cursor-pointer bg-white rounded-sm overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500"
      >
        <div className="relative h-48 sm:h-56 overflow-hidden">
          {dishSlideImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={dish.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === slideIndex ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
              {t('restaurant.dishCard.badge')}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-brand-700 text-xs font-bold rounded-sm shadow-sm">
              {dish.price}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-sm text-slate-800 text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <Eye className="w-4 h-4" />
              {t('restaurant.dishCard.viewDetails')}
            </div>
          </div>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {dishSlideImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === slideIndex
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-lg font-serif text-slate-900 group-hover:text-brand-600 transition-colors duration-300">
              {dish.name}
            </h4>
            <span className="text-xs text-brand-600 font-medium whitespace-nowrap mt-1">
              {dish.price}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-2">
            {dish.desc}
          </p>
          <div className="flex items-center gap-0.5 mt-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </motion.div>
      <DetailModal item={selectedDish} onClose={() => setSelectedDish(null)} />
    </>
  );
}

export function RestaurantPage() {
  const { t } = useTranslation();
  const { openModal } = useContactModal();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const highlightData = t('restaurant.highlights.items', { returnObjects: true }) as {
    title: string; hours: string; desc: string;
  }[];

  const restaurantHighlights = highlightData.map((item, i) => ({
    title: item.title,
    hours: item.hours,
    description: item.desc,
    icon: i === 0 ? <Coffee className="w-6 h-6" /> : <UtensilsCrossed className="w-6 h-6" />,
    image: highlightImages[i]
  }));

  const dishData = t('restaurant.dishes', { returnObjects: true }) as {
    name: string; desc: string; price: string; highlights: string[]; ingredients: string[];
  }[];

  const signatureDishes: DishDetail[] = dishData.map((dish, i) => ({
    type: 'dish',
    name: dish.name,
    desc: dish.desc,
    price: dish.price,
    image: dishImages[i],
    highlights: dish.highlights,
    ingredients: dish.ingredients
  }));

  return (
    <div className="min-h-screen bg-slate-50">
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
            <div className="absolute inset-0 bg-slate-900/55 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/20 to-slate-900/80" />
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
              {t('restaurant.hero.badge')}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight">
              {t('restaurant.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light">
              {t('restaurant.hero.subtitle')}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3">
                {t('restaurant.intro.badge')}
              </h2>
              <h3 className="text-4xl font-serif text-slate-900 mb-6 leading-tight">
                {t('restaurant.intro.title')}
              </h3>
              <div className="space-y-4 text-slate-600 font-light leading-relaxed">
                <p>{t('restaurant.intro.p1')}</p>
                <p>{t('restaurant.intro.p2')}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-sm shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80"
                  alt={t('restaurant.intro.badge')}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-1/3 aspect-square border-8 border-white overflow-hidden rounded-sm shadow-lg hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80"
                  alt="Ambiance du restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== RESTAURANT HIGHLIGHTS ===== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3">
              {t('restaurant.highlights.badge')}
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 mb-6">
              {t('restaurant.highlights.title')}
            </h3>
            <p className="text-slate-600 font-light">
              {t('restaurant.highlights.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-20">
            {restaurantHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  index % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:order-1 lg:text-right' : 'lg:order-2'}`}>
                  <div className={`flex items-center gap-3 mb-4 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif text-slate-900 mb-3">{item.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{item.hours}</span>
                  </div>
                  <p className="text-slate-600 font-light leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MENU HIGHLIGHTS ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3">
              {t('restaurant.menu.badge')}
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 mb-6">
              {t('restaurant.menu.title')}
            </h3>
            <p className="text-slate-600 font-light">
              {t('restaurant.menu.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {signatureDishes.map((dish, index) => (
              <DishCard key={dish.name} dish={dish} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESERVATION CTA ===== */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80")',
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
              {t('restaurant.cta.title')}
            </h2>
            <p className="text-slate-300 font-light text-lg mb-10 max-w-2xl mx-auto">
              {t('restaurant.cta.text')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openModal}
                className="px-8 py-4 bg-brand-600 text-white font-medium tracking-wide hover:bg-brand-700 transition-colors"
              >
                {t('restaurant.cta.button')}
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
