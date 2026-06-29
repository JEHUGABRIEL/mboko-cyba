import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Eye, Square, Users, Bed, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DetailModal, type RoomDetail } from './DetailModal';

const roomImageSets = [
  [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80'
  ],
  [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80'
  ]
];

function RoomSlideshow({ images, badge }: { images: string[]; badge?: string }) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative h-56 sm:h-64 overflow-hidden">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">                  {badge && (
            <span className="px-2.5 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
              {badge}
            </span>
          )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        <div className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-sm text-slate-800 text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500">                      <Eye className="w-4 h-4" />
                        {t('chambres.detailButton')}
        </div>
      </div>
    </div>
  );
}

function buildRoomDetail(t: (key: string) => string, index: number): RoomDetail {
  const featuresCount = index === 0 ? 8 : 9;
  return {
    type: 'room',
    name: t(`chambres.rooms.${index}.name`),
    price: t(`chambres.rooms.${index}.price`),
    size: t(`chambres.rooms.${index}.size`),
    capacity: t(`chambres.rooms.${index}.capacity`),
    bed: t(`chambres.rooms.${index}.bed`),
    description: t(`chambres.rooms.${index}.description`),
    features: Array.from({ length: featuresCount }, (_, d) =>
      t(`chambres.rooms.${index}.features.${d}`)
    ),
    image: roomImageSets[index][0],
    badge: t(`chambres.rooms.${index}.badge`)
  };
}

const cardMeta = [
  { sizeKey: 'chambres.rooms.0.size', capacityKey: 'chambres.rooms.0.capacity', bedKey: 'chambres.rooms.0.bed' },
  { sizeKey: 'chambres.rooms.1.size', capacityKey: 'chambres.rooms.1.capacity', bedKey: 'chambres.rooms.1.bed' }
];

export function Rooms() {
  const { t } = useTranslation();
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);

  return (
    <>
      <section id="rooms" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h2 className="text-brand-600 font-medium tracking-widest uppercase text-sm mb-3">
                {t('rooms.badge')}
              </h2>
              <h3 className="text-4xl font-serif text-slate-900 mb-4">
                {t('rooms.title')}
              </h3>
              <p className="text-slate-600 font-light">
                {t('rooms.subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link
                to="/chambres"
                className="hidden md:inline-flex items-center gap-1.5 border-b-2 border-brand-600 text-brand-600 hover:text-brand-800 hover:border-brand-800 pb-1 transition-colors uppercase tracking-wider text-sm font-medium"
              >
                {t('rooms.cta')}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Room Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[0, 1].map((index) => {
              const room = buildRoomDetail(t, index);
              const meta = cardMeta[index];
              return (
                <motion.div
                  key={room.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  onClick={() => setSelectedRoom(room)}
                  className="group cursor-pointer bg-white rounded-sm overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500"
                >
                  {/* Slideshow Image */}
                  <RoomSlideshow
                    images={roomImageSets[index]}
                    badge={room.badge}
                  />

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h4 className="text-xl font-serif text-slate-900 group-hover:text-brand-600 transition-colors duration-300 mb-3">
                      {room.name}
                    </h4>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Square className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        {t(meta.sizeKey)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        {t(meta.capacityKey)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        {t(meta.bedKey)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-2 mb-3">
                      {room.description}
                    </p>

                    {/* Features (first 4) */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4">
                      {room.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                          <span className="font-light truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Divider + Price */}
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <span className="text-lg font-serif text-brand-600">
                        <strong>{room.price}</strong>
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center md:hidden"
          >
            <Link
              to="/chambres"
              className="inline-flex items-center justify-center gap-2 border border-brand-600 text-brand-600 px-6 py-3 uppercase tracking-wider text-sm font-medium w-full hover:bg-brand-50 transition-colors"
            >
              {t('rooms.cta')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <DetailModal item={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </>
  );
}
