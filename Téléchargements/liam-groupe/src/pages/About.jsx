import { Target, Compass, Flag } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import TeamCard from "../components/TeamCard";
import AnimatedCounter from "../components/AnimatedCounter";
import { useAboutStats, useTeam } from "../hooks/useSiteData";
import { img } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function About() {
  const { t } = useTranslation();
  const { data: aboutStats = [] } = useAboutStats();
  const { data: team = [] } = useTeam();
  const missionRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const teamRef = useScrollReveal();

  return (
    <div className="font-body">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[480px]">
        <img
          src={img("apropos-hero", 1920, 700)}
          alt={t('about.heroAlt')}
          width={1920}
          height={700}
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
      </section>

      {/* MISSION */}
      <section className="py-24 px-6" ref={missionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Target}
              eyebrow={t('about.mission.eyebrow')}
              title={t('about.mission.title')}
              align="left"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <p className="text-gray-500 leading-relaxed mb-5">
                {t('about.intro1')}
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                <Trans i18nKey="about.intro2">
                  Notre nom incarne trois valeurs fondamentales :{' '}
                  <strong className="text-ink">Innovation</strong> dans nos
                  approches, <strong className="text-ink">Ambition</strong> dans
                  nos objectifs, et <strong className="text-ink">Mission</strong>{' '}
                  dans notre engagement sans faille pour la jeunesse et les
                  femmes centrafricaines.
                </Trans>
              </p>

              <div className="space-y-6 stagger-children">
                <div className="flex gap-4 reveal">
                  <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold mb-1">{t('about.vision.title')}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {t('about.vision.text')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 reveal">
                  <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold mb-1">{t('about.missionBlock.title')}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {t('about.missionBlock.text')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 reveal">
              <img
                src={img("apropos-1", 600, 700)}
                alt={t('about.images.alt1')}
                width={600}
                height={700}
                className="rounded-2xl object-cover w-full h-[340px] mt-8"
                loading="lazy"
                decoding="async"
              />
              <img
                src={img("apropos-2", 600, 700)}
                alt={t('about.images.alt2')}
                width={600}
                height={700}
                className="rounded-2xl object-cover w-full h-[340px]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS clair */}
      <section className="bg-brand-50/60 py-14 px-6" ref={statsRef}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger-children">
          {aboutStats.map((s) => (
            <div key={s.label} className="reveal">
              <p className="font-heading font-extrabold text-4xl md:text-5xl text-brand-600">
                <AnimatedCounter value={s.value} duration={2000} />
              </p>
              <p className="text-gray-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EQUIPE */}
      <section className="py-24 px-6" ref={teamRef}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <SectionHeading
              icon={Flag}
              eyebrow={t('about.team.eyebrow')}
              title={t('about.team.title')}
              description={t('about.team.description')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
            {team.map((m) => (
              <div key={m.name} className="reveal">
                <TeamCard member={m} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
