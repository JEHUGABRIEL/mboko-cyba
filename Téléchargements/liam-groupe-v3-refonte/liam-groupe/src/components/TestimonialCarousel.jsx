import { useState, useEffect, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import { useTestimonials } from "../hooks/useSiteData";
import useScrollReveal from "../hooks/useScrollReveal";
import SafeImg from "./SafeImg";

function getItemsPerPage() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

export default function TestimonialCarousel() {
  const { t } = useTranslation();
  const { data: testimonials = [] } = useTestimonials();
  const sectionRef = useScrollReveal();

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [page, setPage] = useState(0);

  // Réagit au redimensionnement pour adapter le nombre d'items par page
  useEffect(() => {
    const onResize = () => {
      setItemsPerPage(getItemsPerPage());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Réinitialise la page quand le nombre d'items par page change
  useEffect(() => {
    startTransition(() => {
      setPage(0);
    });
  }, [itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(testimonials.length / itemsPerPage));
  const startIdx = page * itemsPerPage;
  const visible = testimonials.slice(startIdx, startIdx + itemsPerPage);

  const goTo = (p) => setPage(Math.max(0, Math.min(p, totalPages - 1)));

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div ref={sectionRef}>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {visible.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-7 reveal hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex gap-1 text-amber-400 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                {t.image ? (
                  <SafeImg
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                    icon={User}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {t.name?.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{t.name}</p>
                  <p className="text-gray-400 text-xs truncate">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons précédent / suivant */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              aria-label={t("carousel.previous")}
              className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(page + 1)}
              disabled={page >= totalPages - 1}
              aria-label={t("carousel.next")}
              className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

    </div>
  );
}
