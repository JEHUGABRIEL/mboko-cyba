import { useSite } from "./SiteContext";

export function PartnersSection() {
  const { partners } = useSite();
  // Dupliquer les logos pour l'effet infini
  const duplicated = [...partners, ...partners, ...partners];

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
            Nos partenaires
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ils nous font confiance
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-slate-600">
            Nous collaborons avec les plus grandes marques technologiques
            mondiales pour vous offrir des solutions de qualité.
          </p>
        </div>
      </div>

      {/* Slider infini */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="marquee-container">
          <div className="marquee-track flex gap-16 items-center">
            {duplicated.map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center h-20 px-8"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    // Fallback si l'image ne charge pas
                    const target = e.currentTarget;
                    target.style.display = "none";
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<span class="text-lg font-bold text-slate-300">${partner.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
