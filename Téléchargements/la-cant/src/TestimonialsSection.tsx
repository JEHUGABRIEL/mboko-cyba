import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useSite } from "./SiteContext";

export function TestimonialsSection() {
  const { testimonials } = useSite();
  const [current, setCurrent] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const len = testimonials.length;

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(1);
      else if (width < 1024) setVisibleItems(2);
      else setVisibleItems(3);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const maxIndex = Math.max(0, len - visibleItems);
  const clampedCurrent = Math.min(current, maxIndex);

  const next = () => setCurrent((c) => Math.min(c + 1, maxIndex));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ce que disent nos clients
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-slate-600">
            La satisfaction de nos partenaires est notre plus belle
            récompense. Découvrez leurs retours d'expérience.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={containerRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${clampedCurrent * (100 / visibleItems)}%)`,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  <div className="bg-slate-50 rounded-2xl p-8 h-full border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-blue-200 mb-4 flex-shrink-0" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            starIdx < t.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-slate-600 leading-relaxed mb-6 flex-1 italic">
                      "{t.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {t.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-sm truncate">
                          {t.name}
                        </p>
                        <p className="text-slate-500 text-xs truncate">
                          {t.role}, {t.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              disabled={clampedCurrent === 0}
              className="p-2.5 rounded-full border border-slate-300 text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === clampedCurrent
                      ? "bg-blue-600 w-7"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Aller au témoignage ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={clampedCurrent === maxIndex}
              className="p-2.5 rounded-full border border-slate-300 text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
