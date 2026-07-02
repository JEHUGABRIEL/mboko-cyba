import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useSiteData";
import { img } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Events() {
  const { t } = useTranslation();
  const { data: events = [] } = useEvents();
  const [active, setActive] = useState("tous");
  const filtered = active === "tous" ? events : events.filter((e) => e.status === active);
  const sectionRef = useScrollReveal();

  const filters = [
    { key: "tous", label: t('events.all') },
    { key: "a_venir", label: t('events.upcoming') },
    { key: "passe", label: t('events.past') },
  ];

  return (
    <div className="font-body">
      <Navbar />

      <section className="relative h-[480px]">
        <img
          src={img("evenements-hero", 1920, 700)}
          alt={t('events.heroAlt')}
          width={1920}
          height={700}
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
      </section>

      <section className="py-24 px-6" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-14 reveal">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`px-6 py-2.5 rounded-full font-semibold transition-colors ${
                  active === f.key
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {filtered.length > 0 ? filtered.map((e) => (
              <div key={e.slug} className="reveal">
                <EventCard event={e} />
              </div>
            )) : (
              <div className="col-span-full text-center py-16 text-gray-400">
                <p className="text-gray-500 font-medium">{t('events.noEvents')}</p>
                <p className="text-sm mt-1">{t('events.noEventsText')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
