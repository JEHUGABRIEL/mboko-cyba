import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import { useNews } from "../hooks/useSiteData";
import { img } from "../data/siteData";
import useScrollReveal from "../hooks/useScrollReveal";

export default function News_() {
  const { t } = useTranslation();
  const { data: news = [] } = useNews();
  const sectionRef = useScrollReveal();

  return (
    <div className="font-body">
      <Navbar />

      <section className="relative h-[480px]">
        <img
          src={img("actualites-hero", 1920, 700)}
          alt={t('news.heroAlt')}
          width={1920}
          height={700}
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
      </section>

      <section className="py-24 px-6" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {news.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-children">
              {news.map((n) => (
                <div key={n.slug} className="reveal">
                  <NewsCard item={n} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-gray-500 font-medium">{t('news.noNews')}</p>
              <p className="text-sm mt-1">{t('news.noNewsText')}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
