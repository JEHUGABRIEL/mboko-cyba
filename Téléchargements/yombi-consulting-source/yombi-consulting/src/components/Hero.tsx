import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import heroCard from '../assets/hero-card.png';
import founderRobe from '../assets/founder-robe.png';
import founderOfficeLarge from '../assets/founder-office-large.png';
import founderOfficeSmall from '../assets/founder-office-small.png';

// Photos du cabinet utilisées comme arrière-plan du carrousel Hero
const bgSlides = [
  heroCard,
  founderRobe,
  founderOfficeLarge,
  founderOfficeSmall,
];

// Met en surbrillance un mot-clé dans le titre en l'entourant d'un span coloré
// Exemple : "Votre Partenaire Stratégique" avec highlight="Stratégique"
// donne : "Votre Partenaire " + <span>Stratégique</span>
function renderTitle(title: string, highlight: string) {
  if (!title.includes(highlight)) return title;
  const [before, after] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-amber-500">{highlight}</span>
      {after}
    </>
  );
}

// Animation de fondu enchaîné pour chaque slide du carrousel
const slideVariants = {
  enter: { opacity: 0, scale: 1.05 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

export function Hero() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = bgSlides.length;

  // Démarre le défilement automatique toutes les 6 secondes
  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
  }, [totalSlides]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    startAutoplay();
  }, [currentSlide, startAutoplay]);

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-blue-950"
    >
      {/* Carrousel d'images de fond avec fondu enchaîné */}
      <div className="absolute inset-0 z-0" role="region" aria-roledescription="carousel" aria-label="Photos du cabinet">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgSlides[currentSlide]})` }}
          />
        </AnimatePresence>

        {/* Calques de superposition pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/85 via-blue-900/70 to-blue-950/85 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-blue-950/30 z-[1]" />
      </div>

      {/* Dots indicateurs du carrousel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {bgSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? 'w-8 h-2 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-400 text-sm font-semibold tracking-wider mb-6 border border-amber-500/30">
              {t('hero.badge')}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 font-serif">
              {renderTitle(t('hero.title'), t('hero.titleHighlight'))}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <a
                href="#contact"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-md text-blue-950 bg-amber-500 hover:bg-amber-400 transition-colors"
              >
                {t('hero.cta.contactUs')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#services"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-md text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                {t('hero.cta.discoverServices')}
              </a>
            </div>


          </motion.div>


        </div>
      </div>
    </section>
  );
}
