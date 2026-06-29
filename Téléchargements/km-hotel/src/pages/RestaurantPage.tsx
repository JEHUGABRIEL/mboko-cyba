import { useState, useEffect, useCallback } from 'react';
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

const restaurantHighlights = [
  {
    title: 'Petit-Déjeuner Buffet',
    icon: <Coffee className="w-6 h-6" />,
    hours: '06:30 - 10:00',
    description:
      'Un buffet généreux mêlant viennoiseries artisanales, fruits frais, spécialités locales et boissons chaudes. De quoi bien démarrer la journée.',
    image:
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80'
  },
  {
    title: 'Déjeuner & Dîner',
    icon: <UtensilsCrossed className="w-6 h-6" />,
    hours: '12:00 - 14:00 / 19:00 - 22:30',
    description:
      'Une carte raffinée qui sublime les produits locaux : poisson du fleuve Oubangui, viande grillée, légumes frais du marché, le tout relevé de saveurs internationales.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80'
  }
];

const signatureDishes: DishDetail[] = [
  {
    type: 'dish',
    name: 'Brochettes de Capitaine',
    desc: 'Poisson du fleuve Oubangui mariné aux épices locales, servi avec riz parfumé et légumes sautés',
    price: 'À partir de 8 500 XAF',
    image:
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80',
    highlights: [
      'Poisson frais du fleuve Oubangui',
      'Mariné aux épices locales',
      'Accompagné de riz parfumé',
      'Légumes de saison sautés'
    ],
    ingredients: ['Capitaine (poisson)', 'Épices locales', 'Riz parfumé', 'Légumes frais', 'Huile de palme', 'Ail', 'Citron']
  },
  {
    type: 'dish',
    name: 'Filet de Bœuf au Poivre',
    desc: 'Filet tendre grillé, sauce au poivre vert, gratin dauphinois et haricots verts',
    price: 'À partir de 12 000 XAF',
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80',
    highlights: [
      'Filet de bœuf tendre grillé',
      'Sauce au poivre vert maison',
      'Gratin dauphinois crémeux',
      'Haricots verts frais'
    ],
    ingredients: ['Filet de bœuf', 'Poivre vert', 'Crème fraîche', 'Pommes de terre', 'Haricots verts', 'Beurre', 'Thym']
  },
  {
    type: 'dish',
    name: 'Poulet Yassa revisité',
    desc: 'Cuisses de poulet confites dans une marinade oignons-citron, purée de patate douce',
    price: 'À partir de 9 500 XAF',
    image:
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80',
    highlights: [
      'Cuisses de poulet confites',
      'Marinade oignons-citron',
      'Purée de patate douce onctueuse',
      'Recette traditionnelle revisitée'
    ],
    ingredients: ['Cuisses de poulet', 'Oignons', 'Citron', 'Patate douce', 'Moutarde', "Huile d'olive", 'Persil']
  },
  {
    type: 'dish',
    name: 'Assiette Végétarienne',
    desc: 'Légumes de saison rôtis, quinoa aux herbes, sauce vierge et croustillant de parmesan',
    price: 'À partir de 7 000 XAF',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80',
    highlights: [
      'Légumes de saison rôtis',
      'Quinoa aux herbes fraîches',
      'Sauce vierge maison',
      'Croustillant de parmesan'
    ],
    ingredients: ['Légumes de saison', 'Quinoa', 'Herbes fraîches', 'Parmesan', 'Tomates cerises', "Huile d'olive", 'Basilic']
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

function DishCard({ dish, index }: { dish: DishDetail; index: number }) {
  const [selectedDish, setSelectedDish] = useState<DishDetail | null>(null);

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
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
              Signature
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
              Voir les détails
            </div>
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
              Gastronomie & Détente
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight">
              Notre Restaurant
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light">
              Une expérience culinaire raffinée au cœur de Bangui, où les saveurs locales rencontrent la gastronomie internationale.
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
                Une Table d'Exception
              </h2>
              <h3 className="text-4xl font-serif text-slate-900 mb-6 leading-tight">
                Voyage Culinaire au Cœur de l'Afrique
              </h3>
              <div className="space-y-4 text-slate-600 font-light leading-relaxed">
                <p>
                  Le restaurant du KM Hotel vous invite à un voyage gustatif
                  unique. Notre chef talentueux sublime les produits locaux les
                  plus nobles — poisson frais du fleuve Oubangui, viandes de
                  qualité, fruits et légumes gorgés de soleil — en leur apportant
                  une touche de modernité et de raffinement.
                </p>
                <p>
                  Dans un cadre élégant aux tons chauds et naturels, chaque repas
                  devient une expérience mémorable. Que ce soit pour un petit-déjeuner
                  d'affaires, un déjeuner entre collègues ou un dîner romantique,
                  notre équipe est aux petits soins pour vous.
                </p>
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
                  alt="Restaurant KM Hotel"
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
              Nos Services
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 mb-6">
              Restauration sur Place
            </h3>
            <p className="text-slate-600 font-light">
              Que vous soyez hôte de l'hôtel ou visiteur extérieur, nos espaces
              de restauration vous sont ouverts.
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
              À la Carte
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 mb-6">
              Suggestions du Chef
            </h3>
            <p className="text-slate-600 font-light">
              Notre chef sélectionne les meilleurs produits de saison pour vous
              offrir une carte renouvelée régulièrement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
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
              Réservez Votre Table
            </h2>
            <p className="text-slate-300 font-light text-lg mb-10 max-w-2xl mx-auto">
              Que ce soit pour un dîner romantique, un déjeuner d'affaires ou
              une soirée entre amis, notre équipe vous réserve un accueil
              chaleureux.
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
