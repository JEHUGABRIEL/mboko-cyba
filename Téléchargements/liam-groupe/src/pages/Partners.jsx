import { Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import PartnerCard from "../components/PartnerCard";
import { usePartners } from "../hooks/useSiteData";
import { img } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Partners() {
  const { t } = useTranslation();
  const { data: partners = [] } = usePartners();
  const partnersRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="font-body">
      <Navbar />

      <section className="relative h-[480px]">
        <img
          src={img("partenaires-hero", 1920, 700)}
          alt={t('partners.heroAlt')}
          width={1920}
          height={700}
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
      </section>

      <section className="py-24 px-6" ref={partnersRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Handshake}
              eyebrow={t('partners.eyebrow')}
              title={t('partners.title')}
              description={t('partners.description')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {partners.map((p) => (
              <div key={p.name} className="reveal">
                <PartnerCard partner={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 px-6" ref={ctaRef}>
        <div className="max-w-2xl mx-auto text-center reveal">
          <div className="flex items-center justify-center gap-3 text-brand-500 font-semibold tracking-[0.2em] text-xs uppercase mb-4 reveal">
            <span className="h-px w-10 bg-brand-500/40" />
            {t('partners.cta.eyebrow')}
            <span className="h-px w-10 bg-brand-500/40" />
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4 reveal">
            {t('partners.cta.title')}
          </h2>
          <p className="text-white/60 leading-relaxed mb-9 reveal">
            {t('partners.cta.description')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 reveal">
            <a
              href="#"
              className="px-7 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
            >
              {t('partners.cta.apply')}
            </a>
            <Link
              to="/contact"
              className="px-7 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              {t('partners.cta.contact')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
