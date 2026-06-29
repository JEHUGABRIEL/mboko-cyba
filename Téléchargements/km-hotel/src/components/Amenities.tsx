import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Wifi, Zap, Droplets, Coffee, UtensilsCrossed, Users } from 'lucide-react';

const serviceIcons = [
  <Zap className="w-7 h-7" />,
  <Droplets className="w-7 h-7" />,
  <Wifi className="w-7 h-7" />,
  <UtensilsCrossed className="w-7 h-7" />,
  <Coffee className="w-7 h-7" />,
  <Users className="w-7 h-7" />
];

const serviceImages = [
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600'
];

export function Amenities() {
  const { t } = useTranslation();
  const items = t('amenities.items', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3">
              {t('amenities.badge')}
            </h2>
            <h3 className="text-4xl font-serif text-slate-900 mb-6">
              {t('amenities.title')}
            </h3>
            <p className="text-slate-600 font-light">
              {t('amenities.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((service: { title: string; desc: string }, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-sm shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={serviceImages[index]}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80 group-hover:from-slate-900/60 group-hover:via-slate-900/50 group-hover:to-slate-900/70 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 min-h-[280px] flex flex-col justify-end">
                {/* Icon */}
                <div className="text-brand-300 mb-4 w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-brand-600/30 group-hover:scale-110 transition-all duration-500">
                  {serviceIcons[index]}
                </div>

                {/* Text */}
                <h4 className="text-xl font-serif text-white mb-2 group-hover:text-brand-200 transition-colors duration-300">
                  {service.title}
                </h4>
                <p className="text-sm text-slate-300 font-light leading-relaxed transition-all duration-500 max-h-0 group-hover:max-h-48 overflow-hidden">
                  {service.desc}
                </p>

                {/* Bottom accent line */}
                <div className="mt-4 w-12 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
