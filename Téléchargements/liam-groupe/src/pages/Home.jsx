import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  HeartHandshake,
  MessageSquare,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import DomainCard from "../components/DomainCard";
import EventCard from "../components/EventCard";
import StatsBand from "../components/StatsBand";
import TestimonialCarousel from "../components/TestimonialCarousel";
import { JoinCTA } from "../components/CTASection";
import { useDomains, useEvents, useHomeStats, usePartners, useSiteInfo, useHomeHeroImages } from "../hooks/useSiteData";
import { imgHero, imgBlur } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";
import useUnsavedChanges from "../hooks/useUnsavedChanges";

export default function Home() {
  const { t } = useTranslation();
  const { data: domains = [] } = useDomains();
  const { data: events = [] } = useEvents();
  const { data: homeStats = [] } = useHomeStats();
  const { data: partners = [] } = usePartners();
  const { data: siteInfo = {} } = useSiteInfo();
  const { data: homeHeroImages = [] } = useHomeHeroImages();
  const upcomingAndRecent = events.slice(0, 3);
  const [heroIdx, setHeroIdx] = useState(0);

  const nextHero = useCallback(() => {
    setHeroIdx((prev) => (prev + 1) % (homeHeroImages?.length ?? 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(nextHero, 7000);
    return () => clearInterval(timer);
  }, [nextHero]);

  const heroRef = useScrollReveal({ animation: "animate-fade-in" });
  const domainsRef = useScrollReveal();
  const eventsRef = useScrollReveal();
  const partnersRef = useScrollReveal();
  const testimonialRef = useScrollReveal();
  const contactRef = useScrollReveal();

  // Unsaved changes — formulaire de contact
  const [contactDirty, setContactDirty] = useState(false);
  const { blocker } = useUnsavedChanges(contactDirty);

  return (
    <div className="font-body">
      {/* Preload de la première image hero */}
      <link rel="preload" as="image" href={imgHero("home-hero")} fetchpriority="high" />
      <link rel="preload" as="image" href={imgBlur("home-hero")} />

      <Navbar />

      {/* HERO — Carousel avec blur placeholder progressif */}
      <section className="relative h-[820px] min-h-[640px] flex items-center justify-center text-center px-6 overflow-hidden" ref={heroRef}>
        {/* Blur placeholder — visible pendant le chargement, disparaît quand l'image charge */}
        <div
          className="absolute inset-0 w-full h-full hero-blur-bg opacity-60"
          style={{ backgroundImage: `url(${imgBlur("home-hero")}` }}
        />

        {homeHeroImages?.map((src, i) => {
          const isFirst = i === 0;
          const isActive = i === heroIdx;
          return (
            <img
              key={i}
              src={isFirst ? imgHero("home-hero") : src}
              alt={`Communauté centrafricaine ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              loading={isFirst ? "eager" : "lazy"}
              fetchpriority={isFirst ? "high" : "low"}
              onLoad={(e) => {
                // Disparaît le blur placeholder dès que la première image charge
                if (isFirst) {
                  const blur = e.target.parentElement?.querySelector(".hero-blur-bg");
                  if (blur) blur.style.opacity = "0";
                }
              }}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        {/* Carousel dots */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {homeHeroImages?.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              aria-label={`Image ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === heroIdx ? "w-8 bg-brand-500" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        <div className="relative max-w-4xl reveal">
          <div className="flex items-center justify-center gap-3 text-brand-500 font-semibold tracking-[0.25em] text-xs uppercase mb-6 reveal">
            <span className="h-px w-10 bg-brand-500/60" />
            {t('hero.tagline')}
            <span className="h-px w-10 bg-brand-500/60" />
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight reveal">
            {t('hero.title1')}
            <br />
            <span className="text-brand-500">{t('hero.title2')}</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto mt-6 leading-relaxed reveal">
            {t('hero.description')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-9 reveal">
            <Link
              to="/partenaires"
              className="px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25"
            >
              {t('hero.ctaPartner')}
            </Link>
            <Link
              to="/evenements"
              className="px-7 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-all inline-flex items-center gap-2"
            >
              {t('hero.ctaEvents')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <ChevronDown className="absolute bottom-8 text-white/70 w-6 h-6 animate-bounce" />
      </section>

      {/* DOMAINES */}
      <section className="py-24 px-6" ref={domainsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={LayoutGrid}
              eyebrow={t('home.domains.eyebrow')}
              variant="brand"
              title={t('home.domains.title')}
              description={t('home.domains.description')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {domains.map((d) => (
              <div key={d.slug} className="reveal">
                <DomainCard domain={d} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENEMENTS */}
      <section className="py-24 px-6 bg-gray-50" ref={eventsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal">
            <div>
              <p className="text-brand-500 italic font-medium mb-2">
                {t('home.events.eyebrow')}
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl">{t('home.events.title')}</h2>
            </div>
            <Link
              to="/evenements"
              className="text-brand-600 font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              {t('home.events.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger-children">
            {upcomingAndRecent.map((e) => (
              <div key={e.slug} className="reveal">
                <EventCard event={e} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <StatsBand
        title={t('home.stats.title')}
        description={t('home.stats.description')}
        stats={homeStats}
        tone="brand"
      />

      {/* CONFIANCE / PARTENAIRES — Défilement infini */}
      <section className="py-24 px-6 overflow-hidden" ref={partnersRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={HeartHandshake}
              eyebrow={t('home.partners.eyebrow')}
              title={t('home.partners.title')}
              description={t('home.partners.description')}
            />
          </div>

          <div className="relative reveal">
            {/* Gradient masks on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div className="overflow-hidden py-4">
              <div className="flex gap-16 items-center animate-scroll hover:[animation-play-state:paused]">
                {[...partners, ...partners].map((p, i) => (
                  <div
                    key={i}
                    className="shrink-0 flex items-center justify-center h-24 w-40 grayscale hover:grayscale-0 transition-all duration-500"
                  >
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-heading font-bold text-xl transition-transform duration-300 hover:scale-110"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.initial}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10 reveal">
            <Link
              to="/partenaires"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/25"
            >
              {t('home.partners.cta')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-24 px-6 bg-gray-50" ref={testimonialRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={MessageSquare}
              eyebrow={t('home.testimonials.eyebrow')}
              variant="blue"
              title={t('home.testimonials.title')}
              description={t('home.testimonials.description')}
            />
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      <JoinCTA />

      {/* CONTACT */}
      <section className="py-24 px-6" ref={contactRef}>
        <div className="max-w-6xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Mail}
              eyebrow={t('home.contact.eyebrow')}
              variant="brand"
              title={t('home.contact.title')}
              description={t('home.contact.description')}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start reveal">
            <div className="space-y-7 stagger-children">
              <div className="reveal"><ContactItem icon={MapPin} label={t('home.contact.address')} lines={siteInfo.address} /></div>
              <div className="reveal"><ContactItem icon={Phone} label={t('home.contact.phone')} lines={siteInfo.phones} /></div>
              <div className="reveal"><ContactItem icon={Mail} label={t('home.contact.email')} lines={siteInfo.emails} /></div>
              <div className="reveal"><ContactItem icon={Clock} label={t('home.contact.hours')} lines={siteInfo.hours} /></div>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); setContactDirty(false); }}
              className="bg-white border border-gray-100 shadow-card rounded-2xl p-8 space-y-5 reveal"
              onInput={() => setContactDirty(true)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label={t('home.contact.formName')} placeholder={t('home.contact.formNamePlaceholder')} name="contact-name" />
                <Field label={t('home.contact.formEmail')} placeholder={t('home.contact.formEmailPlaceholder')} type="email" name="contact-email" />
              </div>
              <div>
                <label htmlFor="home-subject" className="block text-sm font-medium mb-2">{t('home.contact.formSubject')}</label>
                <select id="home-subject" name="subject" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400 text-gray-600">
                  <option>{t('home.contact.formSubjectPlaceholder')}</option>
                  <option>{t('home.contact.formSubjectOption1')}</option>
                  <option>{t('home.contact.formSubjectOption2')}</option>
                  <option>{t('home.contact.formSubjectOption3')}</option>
                  <option>{t('home.contact.formSubjectOption4')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="home-message" className="block text-sm font-medium mb-2">{t('home.contact.formMessage')}</label>
                <textarea
                  id="home-message"
                  name="message"
                  rows={5}
                  placeholder={t('home.contact.formMessagePlaceholder')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-brand-500/25"
              >
                <Send className="w-4 h-4" /> {t('home.contact.formSubmit')}
              </button>
            </form>

            {/* Blocker modal — changements non sauvegardés */}
            {blocker.state === "blocked" && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                <div className="fixed inset-0 bg-black/50" onClick={() => blocker.reset()} />
                <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <Send className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {t('home.contact.blockerTitle')}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {t('home.contact.blockerText')}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => blocker.reset()}
                      className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      {t('home.contact.blockerStay')}
                    </button>
                    <button
                      onClick={() => blocker.proceed()}
                      className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                    >
                      {t('home.contact.blockerLeave')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ContactItem({ icon: Icon, label, lines = [] }) {
  return (
    <div className="flex gap-4">
      <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="font-heading font-bold">{label}</p>
        {(lines ?? []).map((l) => (
          <p key={l} className="text-gray-500">
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", name }) {
  const fieldId = name || `field-${label?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium mb-2">{label}</label>
      <input
        id={fieldId}
        name={fieldId}
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400"
      />
    </div>
  );
}
