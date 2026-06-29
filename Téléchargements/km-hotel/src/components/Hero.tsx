import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1542314831-c6a4d14d4c57?auto=format&fit=crop&q=80',
    altKey: 'hero.slideAlt1'
  },
  {
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
    altKey: 'hero.slideAlt2'
  },
  {
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80',
    altKey: 'hero.slideAlt3'
  },
  {
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c0d13c05?auto=format&fit=crop&q=80',
    altKey: 'hero.slideAlt4'
  }
];

export function Hero() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
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
          <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/80" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-brand-300 font-medium tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
            {t(`hero.slides.${current}.badge`)}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 leading-tight">
            {t(`hero.slides.${current}.title`)} <br className="hidden md:block" />
            <span className="italic font-light text-brand-100">
              {t(`hero.slides.${current}.titleAccent`)}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light">
            {t(`hero.slides.${current}.subtitle`)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-4 bg-brand-600 text-white font-medium tracking-wide hover:bg-brand-700 transition-colors w-full sm:w-auto text-center"
            >
              {t('hero.ctaBook')}
            </a>
            <a
              href="/#about"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium tracking-wide border border-white/30 hover:bg-white/20 transition-colors w-full sm:w-auto text-center"
            >
              {t('hero.ctaDiscover')}
            </a>
          </div>
        </motion.div>
      </div>


      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
}
