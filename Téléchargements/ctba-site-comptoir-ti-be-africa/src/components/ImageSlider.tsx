import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageSlider({ images, alt, className = '' }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const slides = images.length > 0 ? images : [];
  const hasMultiple = slides.length > 1;

  const goTo = useCallback((index: number) => {
    setCurrent(((index % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance every 5s
  useEffect(() => {
    if (!hasMultiple) return;
    intervalRef.current = setInterval(goNext, 5000);
    return () => clearInterval(intervalRef.current);
  }, [hasMultiple, goNext]);

  // Pause auto-advance on hover
  const pauseAuto = () => clearInterval(intervalRef.current);
  const resumeAuto = () => {
    clearInterval(intervalRef.current);
    if (hasMultiple) intervalRef.current = setInterval(goNext, 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };

  if (slides.length === 0) return null;

  return (
    <div
      className={`relative w-full h-full bg-slate-100 overflow-hidden select-none group ${className}`}
      onMouseEnter={pauseAuto}
      onMouseLeave={resumeAuto}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="min-w-full h-full flex-shrink-0">
            <img
              src={src}
              alt={`${alt} - ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Prev/Next arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-brand-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label="Image précédente"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-brand-600 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label="Image suivante"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Thumbnail dots */}
      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-white w-5 shadow-sm'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
