import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, User, Star } from 'lucide-react';

function AnimatedCounter({ value, suffix = '', label, icon }: { value: number; suffix?: string; label: string; icon: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-center p-5 bg-slate-50 rounded-sm border border-slate-100 hover:border-brand-200 hover:bg-brand-50/50 transition-all duration-300">
      <div className="text-brand-500 mb-2 flex justify-center">{icon}</div>
      <p className="text-3xl font-serif text-slate-900 mb-1">
        {count}{suffix}
      </p>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
    </div>
  );
}

export function About() {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #000 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main image */}
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-xl relative group">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80"
                alt={t('about.imgAlt1')}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Offset image */}
            <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square border-8 border-white overflow-hidden rounded-sm hidden md:block shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c0d13c05?auto=format&fit=crop&q=80"
                alt={t('about.imgAlt2')}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative badge on image */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-sm shadow-sm hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-700 uppercase tracking-wider">KM Hotel</span>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            <span className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3 block">
              {t('about.badge')}
            </span>
            <h3 className="text-4xl font-serif text-slate-900 mb-6 leading-tight">
              {t('about.title')}
            </h3>

            <div className="space-y-5 text-slate-600 font-light leading-relaxed">
              <p>
                <Trans i18nKey="about.p1" />
              </p>
              <p>{t('about.p2')}</p>
              <p>{t('about.p3')}</p>
            </div>

            {/* Timeline milestone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex items-start gap-4 p-4 bg-brand-50/50 border-l-2 border-brand-500 rounded-sm"
            >
              <Calendar className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-900">5 Juin 2026</p>
                <p className="text-xs text-slate-500 font-light">
                  {t('about.p2')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <AnimatedCounter
            value={31}
            label={t('about.statRooms')}
            icon={<Star className="w-5 h-5" />}
          />
          <AnimatedCounter
            value={3}
            suffix="★"
            label={t('about.statStars')}
            icon={<Star className="w-5 h-5" />}
          />
          <AnimatedCounter
            value={2026}
            label="Ouverture"
            icon={<Calendar className="w-5 h-5" />}
          />
          <AnimatedCounter
            value={1}
            suffix=" F.K."
            label="Fondateur"
            icon={<User className="w-5 h-5" />}
          />
        </motion.div>
      </div>
    </section>
  );
}
