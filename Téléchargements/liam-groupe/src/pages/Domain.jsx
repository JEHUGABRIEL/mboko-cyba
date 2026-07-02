import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Target, Layers, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import StatsBand from "../components/StatsBand";
import { ActCTA } from "../components/CTASection";
import { DomainIcon } from "../components/DomainIcon";
import { useDomain } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";
import GalleryLightbox from "../components/GalleryLightbox";

export default function Domain() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: domain } = useDomain(slug);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const objectivesRef = useScrollReveal();
  const programsRef = useScrollReveal();
  const galleryRef = useScrollReveal();

  if (!domain) return <Navigate to="/domaines" replace />;

  return (
    <div className="font-body">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[560px]">
        <img
          src={domain.heroImage}
          alt={domain.name}
          width={1920}
          height={700}
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
      </section>

      {/* OBJECTIFS */}
      <section className="py-24 px-6" ref={objectivesRef}>
        <div className="max-w-5xl mx-auto">
          <div className="reveal"><SectionHeading icon={Target} eyebrow={t('domain.objectives.eyebrow')} title={t('domain.objectives.title')} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
            {domain.objectives.map((o, i) => (
              <div
                key={o}
                className="flex gap-4 items-start border border-gray-100 rounded-2xl p-6 shadow-card reveal"
              >
                <span className="w-9 h-9 rounded-full bg-brand-50 text-brand-500 font-heading font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-gray-600 leading-relaxed pt-1">{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="py-24 px-6 bg-gray-50" ref={programsRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal"><SectionHeading icon={Layers} eyebrow={t('domain.programs.eyebrow')} title={t('domain.programs.title')} /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
            {domain.programs.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-card p-7 reveal hover:lift transition-all duration-300">
                <span className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                  <DomainIcon icon={domain.icon} className="w-6 h-6" />
                </span>
                <h3 className="font-heading font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsBand stats={domain.stats} tone="brand" />

      {/* GALERIE */}
      <section className="py-24 px-6" ref={galleryRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal"><SectionHeading icon={ImageIcon} eyebrow={t('domain.gallery.eyebrow')} title={t('domain.gallery.title')} /></div>
          {domain.gallery.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {domain.gallery.map((src, i) => (
                <div key={i} className="reveal group cursor-pointer" onClick={() => setLightboxIndex(i)}>
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={src}
                      alt={`${domain.name} ${i + 1}`}
                      width={700}
                      height={500}
                      className="object-cover w-full h-[380px] transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center gap-2 bg-white/90 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                          <ImageIcon className="w-4 h-4" />
                          {t('domain.gallery.enlarge')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {domain.gallery.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-gray-500 font-medium">{t('domain.gallery.empty')}</p>
              <p className="text-sm mt-1">{t('domain.gallery.emptySub')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={domain.gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <ActCTA title={`${t('domain.cta.support')} ${domain.name}`} />

      <Footer />
    </div>
  );
}
