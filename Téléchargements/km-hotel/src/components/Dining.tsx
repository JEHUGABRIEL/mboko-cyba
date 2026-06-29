import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const galleryImages = [
  'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80'
];

export function Dining() {
  const { t } = useTranslation();
  return (
    <section id="dining" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h2 className="text-brand-400 font-medium tracking-widest uppercase text-sm mb-3">
            {t('dining.badge')}
          </h2>
          <h3 className="text-4xl font-serif mb-4 leading-tight">
            {t('dining.title')} <br /> {t('dining.titleBr')}
          </h3>
          <p className="text-slate-300 font-light leading-relaxed">
            {t('dining.p1')}
          </p>
        </motion.div>

        {/* Image gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14"
        >
          {galleryImages.map((src, i) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-sm aspect-[4/3] ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </motion.div>

        {/* Info + CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm"
        >
          {/* Hours */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-sm font-semibold text-white mb-1">{t('dining.breakfast')}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 justify-center">
                <Clock className="w-3 h-3" />
                {t('dining.breakfastHours')}
              </p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-sm font-semibold text-white mb-1">{t('dining.dinner')}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 justify-center">
                <Clock className="w-3 h-3" />
                {t('dining.dinnerHours')}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/restaurant"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-medium uppercase tracking-wider hover:bg-brand-700 transition-colors"
            >
              {t('nav.restaurantSub')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/bar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white text-sm font-medium uppercase tracking-wider border border-white/30 hover:bg-white/20 transition-colors"
            >
              {t('nav.barSub')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
