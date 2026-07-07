import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Slide } from '../context/SiteContext';
type HeroSliderProps = {
  slides: Slide[];
  bgImage?: string;
  height?: string;
  children?: React.ReactNode;
};
export function HeroSlider({
  slides,
  bgImage = 'https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/defaults/batiment-hero',
  height = 'py-24 lg:py-32',
  children
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mountedRef = useRef(true);
  const slidesLenRef = useRef(slides?.length ?? 0);
  slidesLenRef.current = slides?.length ?? 0;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      if (mountedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % slidesLenRef.current);
      }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides?.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      {/* Arrière-plan avec transition crossfade par slide */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, idx) => {
          const imgSrc = slide.image || bgImage;
          const isActive = idx === currentIndex;
          return (
            <img
              key={slide.id}
              src={imgSrc}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
              }}
            />
          );
        })}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30"></div>
      </div>

      <div
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${height} flex flex-col justify-center min-h-[400px]`}>

        <div className="max-w-3xl relative h-[200px] md:h-[250px]">
          {slides.map((slide, idx) => (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: idx === currentIndex ? 1 : 0,
                y: idx === currentIndex ? 0 : 12,
              }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{
                pointerEvents: idx === currentIndex ? 'auto' : 'none',
              }}
            >
              {idx === currentIndex ? (
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-lg md:text-xl text-slate-300 mb-10"
                  >
                    {slide.subtitle}
                  </motion.p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 mb-10">
                    {slide.subtitle}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 mt-8 md:mt-4"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}