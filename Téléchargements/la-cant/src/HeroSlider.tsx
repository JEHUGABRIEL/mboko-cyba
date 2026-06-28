import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useSite } from "./SiteContext";

interface HeroSliderProps {
  onScrollToServices: () => void;
  onScrollToContact: () => void;
}

export function HeroSlider({
  onScrollToServices,
  onScrollToContact,
}: HeroSliderProps) {
  const { heroSlides } = useSite();
  const [current, setCurrent] = useState(0);
  const len = heroSlides.length;

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => ((prev + 1) % len + len) % len);
    }, 5000);
    return () => clearInterval(timer);
  }, [len]);

  return (
    <section
      id="accueil"
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
    >
      {/* Images avec transition */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === current ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80 mix-blend-multiply z-10" />
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Contenu avec animation */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="lg:w-2/3">
          {/* Badge */}
          <div className="overflow-hidden">
            <span
              key={`badge-${current}`}
              className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-100 text-sm font-semibold tracking-wider mb-6 border border-blue-400/30 backdrop-blur-sm animate-fadeInUp"
            >
              {heroSlides[current].badge}
            </span>
          </div>

          {/* Titre */}
          <h1
            key={`title-${current}`}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp"
            style={{ animationDelay: "0.1s" }}
          >
            {heroSlides[current].title}{" "}
            <span className="text-blue-400">
              {heroSlides[current].highlight}
            </span>
          </h1>

          {/* Sous-titre */}
          <p
            key={`sub-${current}`}
            className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            {heroSlides[current].subtitle}
          </p>

          {/* Boutons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={onScrollToServices}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-md font-semibold text-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              Découvrir nos services
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onScrollToContact}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-md font-semibold text-lg transition-all backdrop-blur-sm"
            >
              Demander un devis
            </button>
          </div>
        </div>
      </div>

      {/* Indicateurs (dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
