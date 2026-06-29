import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonialsData = [
  {
    name: 'Christiane M.',
    location: 'Paris, France',
    role: 'Voyage d\'affaires',
    avatar: 'CM',
    rating: 5,
    text: 'Un séjour exceptionnel au KM Hotel. L\'accueil est chaleureux, les chambres sont spacieuses et élégantes. La connexion Wi-Fi est parfaite pour travailler. Le petit-déjeuner buffet est un régal. Je reviendrai sans hésiter lors de mon prochain voyage à Bangui.'
  },
  {
    name: 'Arsène B.',
    location: 'Douala, Cameroun',
    role: 'Séminaire professionnel',
    avatar: 'AB',
    rating: 5,
    text: 'J\'ai organisé un séminaire de deux jours au KM Hotel. Les salles de conférence sont modernes et bien équipées. L\'équipe a été d\'un professionnalisme remarquable. Le restaurant nous a régalés midi et soir. Une adresse incontournable pour les professionnels.'
  },
  {
    name: 'Marie-Claire K.',
    location: 'Bangui, Centrafrique',
    role: 'Dîner en couple',
    avatar: 'MK',
    rating: 5,
    text: 'Mon mari et moi avons fêté notre anniversaire de mariage au restaurant du KM Hotel. Un cadre magnifique, un service attentionné et des plats délicieux. Le Filet de Bœuf au Poivre était divin. Merci à toute l\'équipe pour cette soirée inoubliable.'
  },
  {
    name: 'Sophie L.',
    location: 'Nairobi, Kenya',
    role: 'Touriste',
    avatar: 'SL',
    rating: 4,
    text: 'Le KM Hotel est une belle découverte. La literie est confortable, la climatisation efficace et l\'autonomie électrique est un vrai plus à Bangui. Le bar lounge est cosy et les cocktails sont excellents. Je recommande vivement.'
  },
  {
    name: 'Jean-Pascal T.',
    location: 'Paris, France',
    role: 'Mission humanitaire',
    avatar: 'JT',
    rating: 5,
    text: 'Je séjourne régulièrement au KM Hotel lors de mes missions. La constance dans la qualité du service est remarquable. L\'équipe est aux petits soins, toujours souriante. Le rapport qualité-prix est excellent pour le standing proposé.'
  },
  {
    name: 'Fatima N.',
    location: 'Abidjan, Côte d\'Ivoire',
    role: 'Voyage d\'affaires',
    avatar: 'FN',
    rating: 5,
    text: 'Un hôtel qui mérite amplement sa réputation. Dès l\'arrivée, on se sent accueilli comme un invité de marque. Les chambres sont impeccables, la nourriture est savoureuse et l\'emplacement en centre-ville est idéal pour les déplacements professionnels.'
  },
  {
    name: 'David K.',
    location: 'Lomé, Togo',
    role: 'Conférencier',
    avatar: 'DK',
    rating: 5,
    text: 'Je suis intervenu lors d\'une conférence au KM Hotel. L\'équipement audiovisuel est de qualité, le personnel très professionnel. La salle de conférence était parfaite et l\'hébergement irréprochable. Un cadre idéal pour les événements professionnels à Bangui.'
  },
  {
    name: 'Amina D.',
    location: 'Yaoundé, Cameroun',
    role: 'Voyage d\'affaires',
    avatar: 'AD',
    rating: 4,
    text: 'Hôtel très agréable avec un personnel attentif. Les chambres sont propres et bien équipées. Le petit-déjeuner est copieux et varié. Seul bémol : le restaurant était complet le premier soir, mais le bar lounge nous a accueillis avec des excellents cocktails.'
  },
  {
    name: 'Pierre-Louis B.',
    location: 'Bordeaux, France',
    role: 'Touriste',
    avatar: 'PB',
    rating: 5,
    text: 'Un véritable havre de paix au cœur de Bangui. L\'autonomie électrique est un vrai plus dans cette ville. Les jardins sont magnifiques, la piscine est superbe. Nous avons passé un séjour merveilleux en famille. Les enfants ont adoré. Merci à toute l\'équipe !'
  },
  {
    name: 'Grace N.',
    location: 'Kinshasa, RDC',
    role: 'Journaliste',
    avatar: 'GN',
    rating: 5,
    text: 'Le KM Hotel est devenu mon pied-à-terre lors de mes reportages à Bangui. La connexion Wi-Fi est fiable, ce qui est essentiel pour mon travail. Le calme des chambres permet de travailler en toute sérénité. Le personnel est toujours souriant et serviable.'
  },
  {
    name: 'Mamadou T.',
    location: 'Bamako, Mali',
    role: 'Mission diplomatique',
    avatar: 'MT',
    rating: 5,
    text: 'Dans le cadre d\'une mission diplomatique, j\'ai séjourné une semaine au KM Hotel. Le professionnalisme de l\'accueil, la qualité des prestations et la discrétion du personnel m\'ont particulièrement impressionné. Le restaurant est excellent. Je recommande vivement.'
  },
  {
    name: 'Hélène R.',
    location: 'Genève, Suisse',
    role: 'ONG humanitaire',
    avatar: 'HR',
    rating: 4,
    text: 'Un excellent point de chute à Bangui. Les chambres sont confortables, la literie est de qualité. Le personnel parle anglais et français, ce qui facilite les échanges. Le room service est rapide et efficace. Le rapport qualité-prix est très bon pour Bangui.'
  },
  {
    name: 'Thierry M.',
    location: 'Dakar, Sénégal',
    role: 'Homme d\'affaires',
    avatar: 'TM',
    rating: 5,
    text: 'Je fréquente régulièrement les hôtels d\'affaires en Afrique centrale. Le KM Hotel se distingue par son design raffiné et son service attentionné. Les salles de réunion sont modernes et bien équipées. Un sans-faute du début à la fin.'
  },
  {
    name: 'Esther W.',
    location: 'Nairobi, Kenya',
    role: 'Voyage de noces',
    avatar: 'EW',
    rating: 5,
    text: 'Nous avons choisi le KM Hotel pour notre voyage de noces et ce fut un choix parfait. L\'ambiance romantique du restaurant, le confort de la suite exécutive et la gentillesse du personnel ont rendu notre séjour inoubliable. Le dîner aux chandelles était magique.'
  },
  {
    name: 'Robert Z.',
    location: 'Brazzaville, Congo',
    role: 'Consultant',
    avatar: 'RZ',
    rating: 5,
    text: 'Je recommande vivement le KM Hotel pour les professionnels en déplacement. Le service de conciergerie est efficace, le transfert aéroport est ponctuel et la connexion Wi-Fi permet de travailler sans interruption. Un hôtel qui tient toutes ses promesses.'
  }
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

const getItemsPerPage = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

export function Testimonials() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [isPaused, setIsPaused] = useState(false);
  const testimonials = testimonialsData;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newItemsPerPage = width < 768 ? 1 : width < 1024 ? 2 : 3;
      setItemsPerPage((prev) => {
        if (prev !== newItemsPerPage) setCurrentPage(0);
        return newItemsPerPage;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const validatedPage = Math.min(currentPage, totalPages - 1);
  const currentItems = testimonials.slice(
    validatedPage * itemsPerPage,
    (validatedPage + 1) * itemsPerPage
  );

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const timer = setInterval(nextPage, 4000);
    return () => clearInterval(timer);
  }, [isPaused, totalPages, nextPage]);

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #000 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3 block">
            {t('testimonials.badge')}
          </span>
          <h2 className="text-4xl font-serif text-slate-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-slate-600 font-light">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {currentItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white border border-slate-100 rounded-sm p-6 sm:p-8 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 text-brand-100 group-hover:text-brand-200 transition-colors duration-500">
                    <Quote className="w-8 h-8" />
                  </div>

                  {/* Stars */}
                  <div className="mb-4">
                    <Stars rating={item.rating} />
                  </div>

                  {/* Text */}
                  <p className="text-slate-600 font-light leading-relaxed text-sm mb-6 line-clamp-5">
                    "{item.text}"
                  </p>

                  {/* Avatar & Info */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                    <div className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {item.avatar}
                    </div>
                    <div className="min-w-0">
                      <strong className="block text-sm text-slate-900 truncate">
                        {item.name}
                      </strong>
                      <span className="text-xs text-slate-500 block truncate">
                        {item.location}
                      </span>
                      <span className="text-[11px] text-brand-600 font-medium uppercase tracking-wider">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => { prevPage(); setIsPaused(true); setTimeout(() => setIsPaused(false), 6000); }}
                className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 rounded-sm"
                aria-label={t('testimonials.ariaPrev')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i); setIsPaused(true); setTimeout(() => setIsPaused(false), 6000); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentPage
                        ? 'bg-brand-600 w-6'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={t('testimonials.ariaDot', { n: i + 1 })}
                  />
                ))}
              </div>

              <button
                onClick={() => { nextPage(); setIsPaused(true); setTimeout(() => setIsPaused(false), 6000); }}
                className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 rounded-sm"
                aria-label={t('testimonials.ariaNext')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
