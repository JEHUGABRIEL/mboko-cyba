import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../context/SiteContext';

type Props = {
  testimonials: Testimonial[];
};

export function TestimonialSlider({ testimonials }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const mountedRef = useRef(true);

  // Détection responsive du nombre de témoignages par slide
  useEffect(() => {
    mountedRef.current = true;
    function handleResize() {
      const width = window.innerWidth;
      if (width < 768) setItemsPerSlide(1);
      else if (width < 1024) setItemsPerSlide(2);
      else setItemsPerSlide(3);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Regrouper les témoignages en pages
  const pages: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
    pages.push(testimonials.slice(i, i + itemsPerSlide));
  }

  const totalPages = pages.length;

  // Auto-slide
  useEffect(() => {
    if (totalPages <= 1) return;
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [totalPages]);

  // Réinitialiser la page quand le nombre d'éléments par slide change
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerSlide]);

  if (!testimonials.length) {
    return (
      <p className="text-center text-slate-500 py-8">
        Aucun témoignage pour le moment.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Track coulissant */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-w-0 w-full flex-shrink-0"
            >
              {page.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative hover:shadow-xl hover:shadow-brand-600/5 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Guillemet décoratif */}
                  <div className="text-red-200 absolute top-6 right-8 opacity-50">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14.017 21L16.439 14.976C16.665 14.384 16.778 13.832 16.778 13.32C16.778 11.808 15.932 11.052 14.24 11.052C13.676 11.052 13.168 11.18 12.724 11.436C12.28 11.692 11.968 12.02 11.788 12.42C11.608 12.82 11.518 13.24 11.518 13.68C11.518 14.544 11.838 15.228 12.478 15.732C13.118 16.236 13.882 16.488 14.77 16.488C14.658 17.064 14.396 17.652 13.984 18.252C13.572 18.852 13.064 19.392 12.46 19.872L14.017 21ZM5.017 21L7.439 14.976C7.665 14.384 7.778 13.832 7.778 13.32C7.778 11.808 6.932 11.052 5.24 11.052C4.676 11.052 4.168 11.18 3.724 11.436C3.28 11.692 2.968 12.02 2.788 12.42C2.608 12.82 2.518 13.24 2.518 13.68C2.518 14.544 2.838 15.228 3.478 15.732C4.118 16.236 4.882 16.488 5.77 16.488C5.658 17.064 5.396 17.652 4.984 18.252C4.572 18.852 4.064 19.392 3.46 19.872L5.017 21Z" />
                    </svg>
                  </div>

                  {/* Étoiles */}
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < testimonial.rating ? 'currentColor' : 'none'}
                        className={i < testimonial.rating ? '' : 'text-slate-300'}
                      />
                    ))}
                  </div>

                  {/* Contenu */}
                  <p className="text-slate-700 mb-8 italic relative z-10 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Auteur */}
                  <div className="flex items-center gap-4">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg shrink-0">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-500 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Points de navigation */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentPage
                  ? 'bg-brand-600 w-8'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Aller au groupe de témoignages ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
